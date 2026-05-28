import 'package:flutter/material.dart';
import 'package:flutter_mobile/models/fee.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class FeesScreen extends StatefulWidget {
  const FeesScreen({super.key});

  @override
  State<FeesScreen> createState() => _FeesScreenState();
}

class _FeesScreenState extends State<FeesScreen> {
  List<Fee> _fees = [];
  bool _loading = true;
  bool _refreshing = false;
  bool _dialogOpen = false;
  Fee? _editing;
  bool _saving = false;

  final _nameCtrl = TextEditingController();
  final _totalCtrl = TextEditingController();
  final _paidCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _totalCtrl.dispose();
    _paidCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    if (!_refreshing) setState(() => _loading = true);
    final f = await api.fetchData('fees');
    setState(() {
      _fees = (f as List).map((e) => Fee.fromJson(e as Map<String, dynamic>)).toList();
      _loading = false;
    });
  }

  Future<void> _onRefresh() async {
    setState(() => _refreshing = true);
    await _load();
    setState(() => _refreshing = false);
  }

  void _openAdd() {
    _editing = null;
    _nameCtrl.clear();
    _totalCtrl.clear();
    _paidCtrl.clear();
    setState(() => _dialogOpen = true);
  }

  void _openEdit(Fee f) {
    _editing = f;
    _nameCtrl.text = f.studentName;
    _totalCtrl.text = f.totalFees.toString();
    _paidCtrl.text = f.paid.toString();
    setState(() => _dialogOpen = true);
  }

  Future<void> _handleSave() async {
    setState(() => _saving = true);
    final totalFees = int.tryParse(_totalCtrl.text) ?? 0;
    final paid = int.tryParse(_paidCtrl.text) ?? 0;
    final due = totalFees - paid;
    final status = due == 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    final data = {
      'studentId': _editing?.studentId ?? 0,
      'studentName': _nameCtrl.text,
      'totalFees': totalFees,
      'paid': paid,
      'due': due,
      'status': status,
    };

    if (_editing != null) {
      await api.updateRecord('fees', {...data, 'id': _editing!.id});
    } else {
      await api.createRecord('fees', data);
    }
    setState(() => _saving = false);
    setState(() => _dialogOpen = false);
    _load();
  }

  Future<void> _handleDelete(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete fee record'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirm == true) {
      await api.deleteRecord('fees', id);
      _load();
    }
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
    final totalDue = _fees.fold(0, (s, f) => s + f.due);
    final totalCollected = _fees.fold(0, (s, f) => s + f.paid);
    final totalFees = _fees.fold(0, (s, f) => s + f.totalFees);
    final collectionRate = _fees.isEmpty ? 0 : (totalCollected / totalFees * 100).round();

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
                    const Text('Fees Status', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                    const SizedBox(height: 4),
                    const Text('Track fee payments', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _summaryCard('Collected', '₹${(totalCollected / 1000).toStringAsFixed(1)}K', const Color(0xFF16a34a)),
                        const SizedBox(width: 8),
                        _summaryCard('Pending', '₹${(totalDue / 1000).toStringAsFixed(1)}K', const Color(0xFFdc2626)),
                        const SizedBox(width: 8),
                        _summaryCard('Total', '₹${(totalFees / 1000).toStringAsFixed(1)}K', const Color(0xFF6366f1)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Chip(
                          avatar: const Icon(Icons.currency_rupee, size: 16, color: Color(0xFF6366f1)),
                          label: Text('$collectionRate% collected', style: const TextStyle(fontSize: 12, color: Color(0xFF6366f1))),
                          backgroundColor: const Color(0xFFeef2ff),
                          side: BorderSide.none,
                        ),
                        SizedBox(
                          height: 36,
                          child: ElevatedButton.icon(
                            onPressed: _openAdd,
                            icon: const Icon(Icons.add, size: 16),
                            label: const Text('Add', style: TextStyle(fontSize: 13)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6366f1),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],
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
                            final f = _fees[i];
                            return ListTile(
                              onTap: () => _openEdit(f),
                              title: Text(f.studentName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                              subtitle: Text('₹${f.totalFees.toString()} · Paid: ₹${f.paid.toString()}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                                        decoration: BoxDecoration(color: _statusBg(f.status), borderRadius: BorderRadius.circular(20)),
                                        child: Text(f.status, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _statusColor(f.status))),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'Due: ₹${f.due.toString()}',
                                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: f.due > 0 ? const Color(0xFFdc2626) : const Color(0xFF16a34a)),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 4),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFdc2626)),
                                    onPressed: () => _handleDelete(f.id),
                                  ),
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
      bottomSheet: _dialogOpen
          ? Container(
              color: Colors.white,
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: BottomSheet(
                backgroundColor: Colors.white,
                onClosing: () => setState(() => _dialogOpen = false),
                enableDrag: false,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                builder: (ctx) {
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(24, 10, 24, 16),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 36, height: 4, decoration: BoxDecoration(color: const Color(0xFFe2e8f0), borderRadius: BorderRadius.circular(2))),
                        const SizedBox(height: 12),
                        Text(_editing != null ? 'Edit Fee Record' : 'New Fee Record',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                        const SizedBox(height: 4),
                        Text(_editing != null ? 'Update the fee details below.' : 'Enter the fee details for a student.',
                            style: const TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                        const SizedBox(height: 20),
                        TextField(
                          controller: _nameCtrl,
                          decoration: _inputDec('Student name'),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: TextField(controller: _totalCtrl, keyboardType: TextInputType.number, decoration: _inputDec('Total fees (₹)'))),
                            const SizedBox(width: 10),
                            Expanded(child: TextField(controller: _paidCtrl, keyboardType: TextInputType.number, decoration: _inputDec('Paid (₹)'))),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Divider(height: 1, color: Color(0xFFf1f5f9)),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () => setState(() => _dialogOpen = false),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: const Color(0xFF64748b),
                                  side: const BorderSide(color: Color(0xFFe2e8f0)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                child: const Text('Cancel'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _saving ? null : _handleSave,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF6366f1),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                child: _saving
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                    : Text(_editing != null ? 'Update' : 'Create'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            )
          : null,
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

  InputDecoration _inputDec(String label) => InputDecoration(
    labelText: label,
    filled: true,
    fillColor: const Color(0xFFf8fafc),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFe2e8f0))),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFe2e8f0))),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF6366f1))),
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
  );
}
