import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  List _timetable = [];
  bool _loading = true;
  bool _dialogOpen = false;
  Map<String, dynamic>? _editingDay;
  int? _editingPeriodIdx;

  final _subjectCtrl = TextEditingController();
  final _facultyCtrl = TextEditingController();
  final _timeCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _subjectCtrl.dispose();
    _facultyCtrl.dispose();
    _timeCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final t = await api.fetchData('timetable');
      setState(() => _timetable = t as List);
    } finally {
      setState(() => _loading = false);
    }
  }

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

  void _openAdd(Map<String, dynamic> day) {
    _editingDay = day;
    _editingPeriodIdx = null;
    _subjectCtrl.clear();
    _facultyCtrl.clear();
    _timeCtrl.clear();
    setState(() => _dialogOpen = true);
  }

  void _openEdit(Map<String, dynamic> day, int idx) {
    _editingDay = day;
    _editingPeriodIdx = idx;
    final p = (day['periods'] as List)[idx] as Map<String, dynamic>;
    _subjectCtrl.text = p['subject'] ?? '';
    _facultyCtrl.text = p['faculty'] ?? '';
    _timeCtrl.text = p['time'] ?? '';
    setState(() => _dialogOpen = true);
  }

  Future<void> _handleSave() async {
    if (_editingDay == null) return;
    final periods = List<Map<String, dynamic>>.from(_editingDay!['periods'] as List);
    if (_editingPeriodIdx != null) {
      periods[_editingPeriodIdx!] = {'subject': _subjectCtrl.text, 'faculty': _facultyCtrl.text, 'time': _timeCtrl.text};
    } else {
      periods.add({'subject': _subjectCtrl.text, 'faculty': _facultyCtrl.text, 'time': _timeCtrl.text});
    }
    await api.updateRecord('timetable', {'id': _editingDay!['id'], 'day': _editingDay!['day'], 'periods': periods});
    setState(() => _dialogOpen = false);
    _load();
  }

  Future<void> _handleDelete(Map<String, dynamic> day, int idx) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete period'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), style: TextButton.styleFrom(foregroundColor: Colors.red), child: const Text('Delete')),
        ],
      ),
    );
    if (confirm == true) {
      final periods = (day['periods'] as List).asMap().entries.where((e) => e.key != idx).map((e) => e.value).toList();
      await api.updateRecord('timetable', {'id': day['id'], 'day': day['day'], 'periods': periods});
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;
    final now = DateTime.now();
    final weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    final todayName = weekdays[now.weekday - 1];

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366f1)))
          : ListView(
              padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
              children: [
                const Text('Timetable', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                const SizedBox(height: 4),
                const Text('Manage weekly class schedule', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                const SizedBox(height: 16),
                Chip(
                  avatar: const Icon(Icons.calendar_today, size: 16, color: Color(0xFF6366f1)),
                  label: Text(todayName, style: const TextStyle(fontSize: 12, color: Color(0xFF6366f1))),
                  backgroundColor: const Color(0xFFeef2ff),
                  side: BorderSide.none,
                ),
                const SizedBox(height: 16),
                ..._timetable.map((day) {
                  final dotColor = _dayColors[day['day']] ?? const Color(0xFF6366f1);
                  final bgColor = _dayBgs[day['day']] ?? const Color(0xFFeef2ff);
                  final isToday = day['day'] == todayName;
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
                              Text(day['day'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                              const Spacer(),
                              if (isToday)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                                  decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(20)),
                                  child: Text('Today', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: dotColor)),
                                ),
                              IconButton(icon: const Icon(Icons.add, size: 20, color: Color(0xFF6366f1)), onPressed: () => _openAdd(day)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          ...(day['periods'] as List).asMap().entries.map((entry) {
                            final j = entry.key;
                            final p = entry.value as Map<String, dynamic>;
                            return Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: j < (day['periods'] as List).length - 1
                                  ? const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0xFFf8fafc))))
                                  : null,
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(p['subject'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                                        Text(p['faculty'] ?? '', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                    decoration: BoxDecoration(color: const Color(0xFFf1f5f9), borderRadius: BorderRadius.circular(8)),
                                    child: Text(p['time'] ?? '', style: const TextStyle(fontSize: 12, fontFamily: 'monospace', color: Color(0xFF64748b))),
                                  ),
                                  IconButton(icon: const Icon(Icons.edit, size: 18, color: Color(0xFF6366f1)), onPressed: () => _openEdit(day, j)),
                                  IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFdc2626)), onPressed: () => _handleDelete(day, j)),
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
                builder: (ctx) => Padding(
                  padding: const EdgeInsets.fromLTRB(24, 10, 24, 16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(width: 36, height: 4, decoration: BoxDecoration(color: const Color(0xFFe2e8f0), borderRadius: BorderRadius.circular(2))),
                      const SizedBox(height: 12),
                      Text(_editingPeriodIdx != null ? 'Edit Period' : 'Add Period', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                      const SizedBox(height: 4),
                      Text('${_editingDay?['day'] ?? ''} — ${_editingPeriodIdx != null ? 'Update period details' : 'Add a new class period'}', style: const TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                      const SizedBox(height: 20),
                      TextField(controller: _subjectCtrl, decoration: _inputDec('Subject')),
                      const SizedBox(height: 12),
                      TextField(controller: _facultyCtrl, decoration: _inputDec('Faculty')),
                      const SizedBox(height: 12),
                      TextField(controller: _timeCtrl, decoration: _inputDec('Time')),
                      const SizedBox(height: 16),
                      const Divider(height: 1, color: Color(0xFFf1f5f9)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => setState(() => _dialogOpen = false),
                              style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFF64748b), side: const BorderSide(color: Color(0xFFe2e8f0)), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)), padding: const EdgeInsets.symmetric(vertical: 14)),
                              child: const Text('Cancel'),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _handleSave,
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366f1), foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)), padding: const EdgeInsets.symmetric(vertical: 14)),
                              child: Text(_editingPeriodIdx != null ? 'Update' : 'Add'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            )
          : null,
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
