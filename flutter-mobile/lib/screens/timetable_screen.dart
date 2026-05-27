import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/store_service.dart' as store;

class TimetableScreen extends StatelessWidget {
  const TimetableScreen({super.key});

  static const _dayColors = {
    'Monday': Color(0xFF6366f1),
    'Tuesday': Color(0xFF16a34a),
    'Wednesday': Color(0xFFd97706),
    'Thursday': Color(0xFFdc2626),
    'Friday': Color(0xFF0891b2),
  };

  static const _dayBgs = {
    'Monday': Color(0xFFeef2ff),
    'Tuesday': Color(0xFFf0fdf4),
    'Wednesday': Color(0xFFfffbeb),
    'Thursday': Color(0xFFfef2f2),
    'Friday': Color(0xFFecfeff),
  };

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;
    final now = DateTime.now();
    final weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    final todayName = weekdays[now.weekday - 1];

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: ListView(
        padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
        children: [
          const Text('Timetable', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
          const SizedBox(height: 4),
          const Text('Weekly class schedule', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
          const SizedBox(height: 16),
          Chip(
            avatar: const Icon(Icons.calendar_today, size: 16, color: Color(0xFF6366f1)),
            label: Text(todayName, style: const TextStyle(fontSize: 12, color: Color(0xFF6366f1))),
            backgroundColor: const Color(0xFFeef2ff),
            side: BorderSide.none,
          ),
          const SizedBox(height: 16),
          ...store.defaultTimetable.map((day) {
            final dotColor = _dayColors[day.day] ?? const Color(0xFF6366f1);
            final bgColor = _dayBgs[day.day] ?? const Color(0xFFeef2ff);
            final isToday = day.day == todayName;
            return Card(
              color: Colors.white,
              elevation: isToday ? 3 : 1,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: isToday ? const BorderSide(color: Color(0xFF6366f1)) : BorderSide.none,
              ),
              margin: const EdgeInsets.only(bottom: 12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(width: 10, height: 10, decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle)),
                        const SizedBox(width: 8),
                        Text(day.day, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                        const Spacer(),
                        if (isToday)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                            decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(20)),
                            child: Text('Today', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: dotColor)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...day.periods.asMap().entries.map((entry) {
                      final j = entry.key;
                      final p = entry.value;
                      return Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: j < day.periods.length - 1
                            ? const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0xFFf8fafc))))
                            : null,
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(p.subject, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                                  Text(p.faculty, style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(color: const Color(0xFFf1f5f9), borderRadius: BorderRadius.circular(8)),
                              child: Text(p.time, style: const TextStyle(fontSize: 12, fontFamily: 'monospace', color: Color(0xFF64748b))),
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
