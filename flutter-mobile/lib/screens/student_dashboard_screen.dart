import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_mobile/providers/auth_provider.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});
  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  List _courses = [];
  List _fees = [];
  List _tests = [];
  bool _loading = true;
  bool _refreshing = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    if (!_refreshing) setState(() => _loading = true);
    final results = await Future.wait([
      api.fetchData('courses'),
      api.fetchData('fees'),
      api.fetchData('tests'),
    ]);
    setState(() {
      _courses = results[0] as List;
      _fees = results[1] as List;
      _tests = results[2] as List;
      _loading = false;
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
    final upcomingTests = _tests.where((t) {
      final d = DateTime.tryParse(t['date'] ?? '');
      return d != null && d.isAfter(DateTime.now());
    }).length;
    final myFee = _fees.isNotEmpty ? _fees.first as Map<String, dynamic> : null;
    final feeStatus = myFee?['status'] == 'paid' ? 'Up to date' : myFee != null ? 'Pending' : 'No records';
    final feeColor = myFee?['status'] == 'paid' ? const Color(0xFF16a34a) : const Color(0xFFdc2626);
    final feeBg = myFee?['status'] == 'paid' ? const Color(0xFFf0fdf4) : const Color(0xFFfef2f2);

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: RefreshIndicator(
        color: const Color(0xFF6366f1),
        onRefresh: _onRefresh,
        child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
                children: _loading
                    ? [SizedBox(height: MediaQuery.of(context).size.height * 0.6, child: const Center(child: CircularProgressIndicator(color: Color(0xFF6366f1))))]
                    : [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('My Dashboard', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                    SizedBox(height: 2),
                    Text('Your academic overview', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                  ],
                ),
                ActionChip(
                  avatar: const Icon(Icons.logout, size: 18, color: Color(0xFF64748b)),
                  label: const Text('Logout', style: TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                  onPressed: () => context.read<AuthProvider>().logout(),
                  backgroundColor: Colors.transparent,
                  side: const BorderSide(color: Color(0xFFe2e8f0)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Wrap(
              runSpacing: 12,
              spacing: 12,
              children: [
                _statCard('Enrolled Courses', '${_courses.length}', Icons.menu_book, const Color(0xFF6366f1), const Color(0xFFeef2ff), MediaQuery.of(context).size.width),
                _statCard('Upcoming Exams', '$upcomingTests', Icons.assignment, const Color(0xFFd97706), const Color(0xFFfffbeb), MediaQuery.of(context).size.width),
                _statCard('Fee Status', feeStatus, Icons.currency_rupee, feeColor, feeBg, MediaQuery.of(context).size.width),
              ],
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
                    const Text('My Courses', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                    const SizedBox(height: 12),
                    ..._courses.map((c) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(c['name'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                                Text('${c['duration'] ?? ''} · ${c['credits']} cr', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: const Color(0xFFeef2ff), borderRadius: BorderRadius.circular(20)),
                            child: Text(c['code'] ?? '', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6366f1))),
                          ),
                        ],
                      ),
                    )),
                    if (!_loading && !_refreshing && _courses.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Center(child: Text('No courses enrolled', style: TextStyle(fontSize: 14, color: Color(0xFF64748b)))),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color, Color bg, double screenWidth) {
    return SizedBox(
      width: (screenWidth - 44) / 2,
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
                  Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748b), fontWeight: FontWeight.w500)),
                  Container(
                    width: 32, height: 32,
                    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
                    child: Icon(icon, size: 18, color: color),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
            ],
          ),
        ),
      ),
    );
  }
}
