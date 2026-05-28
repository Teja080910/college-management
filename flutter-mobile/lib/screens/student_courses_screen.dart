import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class StudentCoursesScreen extends StatefulWidget {
  const StudentCoursesScreen({super.key});

  @override
  State<StudentCoursesScreen> createState() => _StudentCoursesScreenState();
}

class _StudentCoursesScreenState extends State<StudentCoursesScreen> {
  List _courses = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final c = await api.fetchData('courses');
    setState(() => _courses = c as List);
  }

  static const _colors = [
    Color(0xFFeef2ff),
    Color(0xFFf0fdf4),
    Color(0xFFfffbeb),
    Color(0xFFfef2f2),
    Color(0xFFecfeff),
  ];

  static const _chipColors = [
    Color(0xFF6366f1),
    Color(0xFF16a34a),
    Color(0xFFd97706),
    Color(0xFFdc2626),
    Color(0xFF0891b2),
  ];

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: ListView(
        padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
        children: [
          const Text('My Courses', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
          const SizedBox(height: 4),
          const Text('Courses you are enrolled in', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
          const SizedBox(height: 16),
          ..._courses.asMap().entries.map((entry) {
            final i = entry.key;
            final c = entry.value as Map<String, dynamic>;
            final color = _chipColors[i % _chipColors.length];
            final bg = _colors[i % _colors.length];
            return Card(
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
                          child: Text(c['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
                          child: Text(c['code'], style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(c['description'], style: const TextStyle(fontSize: 14, color: Color(0xFF64748b), height: 1.4)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _infoChip(Icons.access_time, c['duration']),
                        const SizedBox(width: 12),
                        _infoChip(Icons.menu_book, '${c['credits']} credits'),
                      ],
                    ),
                    const Divider(height: 24, color: Color(0xFFf1f5f9)),
                    Row(
                      children: [
                        const Icon(Icons.person_outline, size: 14, color: Color(0xFF64748b)),
                        const SizedBox(width: 6),
                        RichText(
                          text: TextSpan(
                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748b)),
                            children: [
                              const TextSpan(text: 'HOD: '),
                              TextSpan(text: c['hod'], style: const TextStyle(fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(color: const Color(0xFFf1f5f9), borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF64748b)),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
        ],
      ),
    );
  }
}
