import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  List _courses = [];
  bool _loading = true;
  bool _dialogOpen = false;
  Map<String, dynamic>? _editing;

  final _nameCtrl = TextEditingController();
  final _codeCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _creditsCtrl = TextEditingController();
  final _hodCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _codeCtrl.dispose();
    _descCtrl.dispose();
    _durationCtrl.dispose();
    _creditsCtrl.dispose();
    _hodCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final c = await api.fetchData('courses');
      setState(() => _courses = c as List);
    } finally {
      setState(() => _loading = false);
    }
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

  void _openAdd() {
    _editing = null;
    _nameCtrl.clear();
    _codeCtrl.clear();
    _descCtrl.clear();
    _durationCtrl.clear();
    _creditsCtrl.clear();
    _hodCtrl.clear();
    setState(() => _dialogOpen = true);
  }

  void _openEdit(Map<String, dynamic> c) {
    _editing = c;
    _nameCtrl.text = c['name'] ?? '';
    _codeCtrl.text = c['code'] ?? '';
    _descCtrl.text = c['description'] ?? '';
    _durationCtrl.text = c['duration'] ?? '';
    _creditsCtrl.text = (c['credits'] ?? '').toString();
    _hodCtrl.text = c['hod'] ?? '';
    setState(() => _dialogOpen = true);
  }

  Future<void> _handleSave() async {
    final payload = {
      'name': _nameCtrl.text,
      'code': _codeCtrl.text,
      'description': _descCtrl.text,
      'duration': _durationCtrl.text,
      'credits': int.tryParse(_creditsCtrl.text) ?? 0,
      'hod': _hodCtrl.text,
    };
    if (_editing != null) {
      await api.updateRecord('courses', {...payload, 'id': _editing!['id']});
    } else {
      await api.createRecord('courses', payload);
    }
    setState(() => _dialogOpen = false);
    _load();
  }

  Future<void> _handleDelete(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete course'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), style: TextButton.styleFrom(foregroundColor: Colors.red), child: const Text('Delete')),
        ],
      ),
    );
    if (confirm == true) {
      await api.deleteRecord('courses', id);
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;

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
                const Text('Course Details', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                const SizedBox(height: 4),
                const Text('Manage all offered programs', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
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
                                child: Text(c['name'] ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF1e293b))),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
                                child: Text(c['code'] ?? '', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
                              ),
                              IconButton(icon: const Icon(Icons.edit, size: 18, color: Color(0xFF6366f1)), onPressed: () => _openEdit(c)),
                              IconButton(icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFdc2626)), onPressed: () => _handleDelete(c['id'])),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(c['description'] ?? '', style: const TextStyle(fontSize: 14, color: Color(0xFF64748b), height: 1.4)),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              _infoChip(Icons.access_time, c['duration'] ?? ''),
                              const SizedBox(width: 12),
                              _infoChip(Icons.menu_book, '${c['credits'] ?? 0} credits'),
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
                                    TextSpan(text: c['hod'] ?? '', style: const TextStyle(fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
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
                        Text(_editing != null ? 'Edit Course' : 'New Course', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                        const SizedBox(height: 4),
                        Text(_editing != null ? 'Update the course information below.' : 'Enter the details for a new course.', style: const TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                        const SizedBox(height: 20),
                        TextField(controller: _nameCtrl, decoration: _inputDec('Course name')),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: TextField(controller: _codeCtrl, decoration: _inputDec('Code'))),
                            const SizedBox(width: 10),
                            Expanded(child: TextField(controller: _creditsCtrl, keyboardType: TextInputType.number, decoration: _inputDec('Credits'))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        TextField(controller: _durationCtrl, decoration: _inputDec('Duration')),
                        const SizedBox(height: 12),
                        TextField(controller: _hodCtrl, decoration: _inputDec('HOD')),
                        const SizedBox(height: 12),
                        TextField(controller: _descCtrl, decoration: _inputDec('Description')),
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
