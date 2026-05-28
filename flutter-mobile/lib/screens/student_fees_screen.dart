import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class StudentFeesScreen extends StatefulWidget {
  const StudentFeesScreen({super.key});

  @override
  State<StudentFeesScreen> createState() => _StudentFeesScreenState();
}

class _StudentFeesScreenState extends State<StudentFeesScreen> {
  List _fees = [];
  bool _loading = true;
  bool _refreshing = false;
  bool _paying = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (!_refreshing) setState(() => _loading = true);
    final f = await api.fetchData('fees');
    setState(() {
      _fees = f as List;
      _loading = false;
    });
  }

  Future<void> _onRefresh() async {
    setState(() => _refreshing = true);
    await _load();
    setState(() => _refreshing = false);
  }

  Future<void> _handlePay(Map<String, dynamic> f) async {
    setState(() => _paying = true);
    final totalFees = f['totalFees'] as int;
    final data = {
      'studentId': f['studentId'],
      'studentName': f['studentName'],
      'totalFees': totalFees,
      'paid': totalFees,
      'due': 0,
      'status': 'paid',
    };
    await api.updateRecord('fees', {...data, 'id': f['id']});
    setState(() => _paying = false);
    _load();
  }

  Color _statusColor(String s) {
    switch (s) {
      case 'paid': return const Color(0xFF16a34a);
      case 'partial': return const Color(0xFFd97706);
      case 'unpaid': return const Color(0xFFdc2626);
      default: return const Color(0xFF64748b);
    }
  }

  Color _statusBg(String s) {
    switch (s) {
      case 'paid': return const Color(0xFFf0fdf4);
      case 'partial': return const Color(0xFFfffbeb);
      case 'unpaid': return const Color(0xFFfef2f2);
      default: return const Color(0xFFf1f5f9);
    }
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;
    final totalPaid = _fees.fold(0, (s, f) => s + (f['paid'] as int));
    final totalDue = _fees.fold(0, (s, f) => s + (f['due'] as int));

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: RefreshIndicator(
        color: const Color(0xFF6366f1),
        onRefresh: _onRefresh,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            if (_loading)
              SliverFillRemaining(
                child: Center(child: CircularProgressIndicator(color: Color(0xFF6366f1))),
              )
            else ...[
              SliverPadding(
                padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, 0),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                    const Text('My Fees', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                    const SizedBox(height: 4),
                    const Text('View fee status and make payments', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _summaryCard('Total Paid', '₹${(totalPaid / 1000).toStringAsFixed(1)}K', const Color(0xFF16a34a)),
                        const SizedBox(width: 8),
                        _summaryCard('Pending Dues', '₹${(totalDue / 1000).toStringAsFixed(1)}K', const Color(0xFFdc2626)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Chip(
                      avatar: const Icon(Icons.currency_rupee, size: 16, color: Color(0xFF6366f1)),
                      label: Text('${_fees.length} record(s)', style: const TextStyle(fontSize: 12, color: Color(0xFF6366f1))),
                      backgroundColor: const Color(0xFFeef2ff),
                      side: BorderSide.none,
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: EdgeInsets.fromLTRB(16, 0, 16, padding.bottom + 24),
              sliver: SliverToBoxAdapter(
                child: Card(
                  color: Colors.white,
                  elevation: 1,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: !_loading && !_refreshing && _fees.isEmpty
                      ? const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No fee records', style: TextStyle(fontSize: 14, color: Color(0xFF64748b)))))
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _fees.length,
                          separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0xFFf1f5f9)),
                          itemBuilder: (ctx, i) {
                            final f = _fees[i] as Map<String, dynamic>;
                            final status = f['status'] as String;
                            final due = f['due'] as int;
                            return ListTile(
                              title: Text(f['studentName'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                              subtitle: Text('₹${f['totalFees'].toString()} · Paid: ₹${f['paid'].toString()}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                                        decoration: BoxDecoration(color: _statusBg(status), borderRadius: BorderRadius.circular(20)),
                                        child: Text(status, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _statusColor(status))),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'Due: ₹$due',
                                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: due > 0 ? const Color(0xFFdc2626) : const Color(0xFF16a34a)),
                                      ),
                                    ],
                                  ),
                                  if (due > 0) ...[
                                    const SizedBox(width: 8),
                                    SizedBox(
                                      height: 32,
                                      child: ElevatedButton(
                                        onPressed: _paying ? null : () => _handlePay(f),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(0xFF6366f1),
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                          padding: const EdgeInsets.symmetric(horizontal: 12),
                                        ),
                                        child: _paying
                                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                            : const Text('Pay Now', style: TextStyle(fontSize: 12)),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryCard(String label, String value, Color color) {
    return Expanded(
      child: Card(
        color: Colors.white,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748b))),
              const SizedBox(height: 4),
              Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: color)),
            ],
          ),
        ),
      ),
    );
  }
}
