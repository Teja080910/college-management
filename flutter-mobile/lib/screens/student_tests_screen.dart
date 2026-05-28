import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class StudentTestsScreen extends StatefulWidget {
  const StudentTestsScreen({super.key});

  @override
  State<StudentTestsScreen> createState() => _StudentTestsScreenState();
}

class _StudentTestsScreenState extends State<StudentTestsScreen> {
  List _tests = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final t = await api.fetchData('tests');
    setState(() => _tests = t as List);
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;
    final sorted = List<Map<String, dynamic>>.from(_tests.map((e) => e as Map<String, dynamic>))
      ..sort((a, b) => DateTime.parse(a['date']).compareTo(DateTime.parse(b['date'])));
    final now = DateTime.now();
    final soonThreshold = Duration(days: 7);

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: ListView(
        padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
        children: [
          const Text('My Tests', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
          const SizedBox(height: 4),
          const Text('Upcoming exams and test schedule', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
          const SizedBox(height: 16),
          Chip(
            avatar: const Icon(Icons.assignment, size: 16, color: Color(0xFF6366f1)),
            label: Text('${sorted.length} exams', style: const TextStyle(fontSize: 12, color: Color(0xFF6366f1))),
            backgroundColor: const Color(0xFFeef2ff),
            side: BorderSide.none,
          ),
          const SizedBox(height: 16),
          ...sorted.map((t) {
            final d = DateTime.parse(t['date']);
            final isSoon = d.isAfter(now) && d.isBefore(now.add(soonThreshold));
            final isPast = d.isBefore(now);
            return Opacity(
              opacity: isPast ? 0.6 : 1,
              child: Card(
              color: Colors.white,
              elevation: 1,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              margin: const EdgeInsets.only(bottom: 12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(t['title'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                              ),
                              if (isSoon)
                                Container(
                                  margin: const EdgeInsets.only(left: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(color: const Color(0xFFfffbeb), borderRadius: BorderRadius.circular(20)),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: const [
                                      Icon(Icons.warning_amber_rounded, size: 12, color: Color(0xFFd97706)),
                                      SizedBox(width: 2),
                                      Text('Soon', style: TextStyle(fontSize: 10, color: Color(0xFFd97706))),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFFeef2ff), borderRadius: BorderRadius.circular(8)),
                          child: Text(t['venue'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6366f1))),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(t['course'], style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                    const Divider(height: 24, color: Color(0xFFf1f5f9)),
                    Row(
                      children: [
                        Icon(Icons.calendar_today, size: 14, color: isPast ? const Color(0xFF94a3b8) : const Color(0xFF64748b)),
                        const SizedBox(width: 4),
                        Text(t['date'], style: TextStyle(
                          fontSize: 12,
                          color: isPast ? const Color(0xFF94a3b8) : const Color(0xFF64748b),
                          decoration: isPast ? TextDecoration.lineThrough : null,
                        )),
                        const SizedBox(width: 16),
                        const Icon(Icons.access_time, size: 14, color: Color(0xFF64748b)),
                        const SizedBox(width: 4),
                        Text(t['time'], style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            );
          }),
        ],
      ),
    );
  }
}
