import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class TestsScreen extends StatefulWidget {
  const TestsScreen({super.key});

  @override
  State<TestsScreen> createState() => _TestsScreenState();
}

class _TestsScreenState extends State<TestsScreen> {
  List _tests = [];
  bool _loading = true;
  bool _dialogOpen = false;
  Map<String, dynamic>? _editing;

  final _titleCtrl = TextEditingController();
  final _courseCtrl = TextEditingController();
  final _dateCtrl = TextEditingController();
  final _timeCtrl = TextEditingController();
  final _venueCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _courseCtrl.dispose();
    _dateCtrl.dispose();
    _timeCtrl.dispose();
    _venueCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final t = await api.fetchData('tests');
      setState(() => _tests = t as List);
    } finally {
      setState(() => _loading = false);
    }
  }

  void _openAdd() {
    _editing = null;
    _titleCtrl.clear();
    _courseCtrl.clear();
    _dateCtrl.clear();
    _timeCtrl.clear();
    _venueCtrl.clear();
    setState(() => _dialogOpen = true);
  }

  void _openEdit(Map<String, dynamic> t) {
    _editing = t;
    _titleCtrl.text = t['title'] ?? '';
    _courseCtrl.text = t['course'] ?? '';
    _dateCtrl.text = t['date'] ?? '';
    _timeCtrl.text = t['time'] ?? '';
    _venueCtrl.text = t['venue'] ?? '';
    setState(() => _dialogOpen = true);
  }

  Future<void> _handleSave() async {
    final payload = {
      'title': _titleCtrl.text,
      'course': _courseCtrl.text,
      'date': _dateCtrl.text,
      'time': _timeCtrl.text,
      'venue': _venueCtrl.text,
    };
    if (_editing != null) {
      await api.updateRecord('tests', {...payload, 'id': _editing!['id']});
    } else {
      await api.createRecord('tests', payload);
    }
    setState(() => _dialogOpen = false);
    _load();
  }

  Future<void> _handleDelete(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete test'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), style: TextButton.styleFrom(foregroundColor: Colors.red), child: const Text('Delete')),
        ],
      ),
    );
    if (confirm == true) {
      await api.deleteRecord('tests', id);
      _load();
    }
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
      floatingActionButton: FloatingActionButton.small(
        onPressed: _openAdd,
        backgroundColor: const Color(0xFF6366f1),
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366f1)))
          : ListView(
              padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, padding.bottom + 24),
              children: [
                const Text('Test Schedule', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                const SizedBox(height: 4),
                const Text('Manage examinations and tests', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
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
                                        child: Text(t['title'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
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
                                  child: Text(t['venue'] ?? '', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF6366f1))),
                                ),
                                IconButton(icon: const Icon(Icons.edit, size: 18, color: Color(0xFF6366f1)), onPressed: () => _openEdit(t)),
                                IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFdc2626)), onPressed: () => _handleDelete(t['id'])),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(t['course'] ?? '', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                            const Divider(height: 24, color: Color(0xFFf1f5f9)),
                            Row(
                              children: [
                                Icon(Icons.calendar_today, size: 14, color: isPast ? const Color(0xFF94a3b8) : const Color(0xFF64748b)),
                                const SizedBox(width: 4),
                                Text(t['date'] ?? '', style: TextStyle(fontSize: 12, color: isPast ? const Color(0xFF94a3b8) : const Color(0xFF64748b), decoration: isPast ? TextDecoration.lineThrough : null)),
                                const SizedBox(width: 16),
                                const Icon(Icons.access_time, size: 14, color: Color(0xFF64748b)),
                                const SizedBox(width: 4),
                                Text(t['time'] ?? '', style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
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
                builder: (ctx) => SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 10, 24, 16),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 36, height: 4, decoration: BoxDecoration(color: const Color(0xFFe2e8f0), borderRadius: BorderRadius.circular(2))),
                        const SizedBox(height: 12),
                        Text(_editing != null ? 'Edit Test' : 'New Test', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                        const SizedBox(height: 4),
                        Text(_editing != null ? 'Update the test details below.' : 'Schedule a new examination.', style: const TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(child: TextField(controller: _titleCtrl, decoration: _inputDec('Title'))),
                            const SizedBox(width: 10),
                            Expanded(child: TextField(controller: _courseCtrl, decoration: _inputDec('Course'))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: TextField(controller: _dateCtrl, decoration: _inputDec('Date'))),
                            const SizedBox(width: 10),
                            Expanded(child: TextField(controller: _timeCtrl, decoration: _inputDec('Time'))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        TextField(controller: _venueCtrl, decoration: _inputDec('Venue')),
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
                                child: Text(_editing != null ? 'Update' : 'Create'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
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
