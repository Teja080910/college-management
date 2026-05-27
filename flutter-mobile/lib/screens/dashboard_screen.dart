import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_mobile/providers/auth_provider.dart';
import 'package:flutter_mobile/services/store_service.dart' as store;
import 'package:flutter_mobile/models/student.dart';
import 'package:flutter_mobile/models/fee.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<Student> _students = [];
  List<Fee> _fees = [];
  bool _refreshing = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final s = await store.getStudents();
    final f = await store.getFees();
    setState(() {
      _students = s;
      _fees = f;
    });
  }

  Future<void> _onRefresh() async {
    setState(() => _refreshing = true);
    await _load();
    setState(() => _refreshing = false);
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;
    final paidCount = _fees.where((f) => f.status == 'paid').length;
    final totalRevenue = _fees.fold(0, (sum, f) => sum + f.paid);
    final upcomingTests = store.defaultTests
        .where((t) => DateTime.tryParse(t.date) != null && DateTime.parse(t.date).isAfter(DateTime.now()))
        .length;

    final stats = [
      {'label': 'Total Students', 'value': '${_students.length}', 'icon': Icons.group, 'color': const Color(0xFF6366f1), 'bg': const Color(0xFFeef2ff)},
      {'label': 'Fees Paid', 'value': '$paidCount/${_fees.length}', 'icon': Icons.currency_rupee, 'color': const Color(0xFF16a34a), 'bg': const Color(0xFFf0fdf4)},
      {'label': 'Revenue', 'value': '₹${(totalRevenue / 1000).toStringAsFixed(1)}K', 'icon': Icons.trending_up, 'color': const Color(0xFFd97706), 'bg': const Color(0xFFfffbeb)},
      {'label': 'Tests', 'value': '$upcomingTests', 'icon': Icons.assignment, 'color': const Color(0xFFdc2626), 'bg': const Color(0xFFfef2f2)},
    ];

    final enrolled = _students.where((s) => s.enrolled).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: RefreshIndicator(
        color: const Color(0xFF6366f1),
        onRefresh: _onRefresh,
        child: ListView(
          padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Dashboard', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                    const SizedBox(height: 2),
                    const Text('Overview of the institution', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                  ],
                ),
                ActionChip(
                  avatar: const Icon(Icons.logout, size: 18, color: Color(0xFF64748b)),
                  label: const Text('Logout', style: TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                  onPressed: () => context.read<AuthProvider>().logout(),
                  side: const BorderSide(color: Color(0xFFe2e8f0)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Wrap(
              runSpacing: 12,
              spacing: 12,
              children: stats.map((s) {
                final icon = s['icon'] as IconData;
                final color = s['color'] as Color;
                final bg = s['bg'] as Color;
                return SizedBox(
                  width: (MediaQuery.of(context).size.width - 44) / 2,
                  child: Card(
                    color: Colors.white,
                    elevation: 2,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(s['label'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF64748b), fontWeight: FontWeight.w500)),
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
                                child: Icon(icon, size: 18, color: color),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(s['value'] as String, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            Card(
              color: Colors.white,
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Enrolled Students', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                    const SizedBox(height: 12),
                    if (enrolled.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Text('No students enrolled', textAlign: TextAlign.center, style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                      )
                    else
                      ...enrolled.map((s) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: const BoxDecoration(color: Color(0xFFeef2ff), shape: BoxShape.circle),
                              child: Center(child: Text(s.name[0], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF6366f1)))),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(s.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                                  Text('${s.age} yrs · ${s.grade}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: const Color(0xFFf0fdf4), borderRadius: BorderRadius.circular(20)),
                              child: const Text('Active', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF16a34a))),
                            ),
                          ],
                        ),
                      )).toList(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
