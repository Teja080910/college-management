import 'package:flutter/material.dart';
import 'package:flutter_mobile/models/student.dart';
import 'package:flutter_mobile/services/api_service.dart' as api;

class StudentsScreen extends StatefulWidget {
  const StudentsScreen({super.key});

  @override
  State<StudentsScreen> createState() => _StudentsScreenState();
}

class _StudentsScreenState extends State<StudentsScreen> {
  List<Student> _students = [];
  List<Student> _filtered = [];
  bool _refreshing = false;
  String _search = '';
  bool _dialogOpen = false;
  Student? _editing;
  bool _saving = false;
  final _formKey = GlobalKey<FormState>();

  final _nameCtrl = TextEditingController();
  final _ageCtrl = TextEditingController();
  final _gradeCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  bool _enrolled = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _ageCtrl.dispose();
    _gradeCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final s = await api.fetchData('students');
    setState(() {
      _students = (s as List).map((e) => Student.fromJson(e as Map<String, dynamic>)).toList();
      _applyFilter();
    });
  }

  void _applyFilter() {
    if (_search.isEmpty) {
      _filtered = List.from(_students);
    } else {
      final q = _search.toLowerCase();
      _filtered = _students.where((s) =>
        s.name.toLowerCase().contains(q) ||
        s.email.toLowerCase().contains(q)
      ).toList();
    }
  }

  Future<void> _onRefresh() async {
    setState(() => _refreshing = true);
    await _load();
    setState(() => _refreshing = false);
  }

  void _openAdd() {
    _editing = null;
    _nameCtrl.clear();
    _ageCtrl.clear();
    _gradeCtrl.clear();
    _emailCtrl.clear();
    _phoneCtrl.clear();
    _enrolled = true;
    setState(() => _dialogOpen = true);
  }

  void _openEdit(Student s) {
    _editing = s;
    _nameCtrl.text = s.name;
    _ageCtrl.text = s.age.toString();
    _gradeCtrl.text = s.grade;
    _emailCtrl.text = s.email;
    _phoneCtrl.text = s.phone;
    _enrolled = s.enrolled;
    setState(() => _dialogOpen = true);
  }

  Future<void> _handleSave() async {
    setState(() => _saving = true);
    final data = {
      'name': _nameCtrl.text,
      'age': int.tryParse(_ageCtrl.text) ?? 0,
      'grade': _gradeCtrl.text,
      'email': _emailCtrl.text,
      'phone': _phoneCtrl.text,
      'enrolled': _enrolled,
    };
    if (_editing != null) {
      await api.updateRecord('students', {...data, 'id': _editing!.id});
    } else {
      await api.createRecord('students', data);
    }
    setState(() => _saving = false);
    setState(() => _dialogOpen = false);
    _load();
  }

  Future<void> _handleDelete(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete student'),
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
      await api.deleteRecord('students', id);
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final padding = MediaQuery.of(context).padding;

    return Scaffold(
      backgroundColor: const Color(0xFFf8fafc),
      body: RefreshIndicator(
        color: const Color(0xFF6366f1),
        onRefresh: _onRefresh,
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: EdgeInsets.fromLTRB(16, padding.top + 16, 16, 0),
              sliver: SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Students', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                    const SizedBox(height: 4),
                    const Text('Manage all registered students', style: TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            onChanged: (v) {
                              setState(() {
                                _search = v;
                                _applyFilter();
                              });
                            },
                            decoration: InputDecoration(
                              hintText: 'Search by name or email...',
                              hintStyle: const TextStyle(fontSize: 14, color: Color(0xFF94a3b8)),
                              filled: true,
                              fillColor: Colors.white,
                              prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFF94a3b8)),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          height: 44,
                          child: ElevatedButton.icon(
                            onPressed: _openAdd,
                            icon: const Icon(Icons.add, size: 18),
                            label: const Text('Add'),
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
                  child: !_refreshing && _filtered.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.all(24),
                          child: Center(child: Text('No students found', style: TextStyle(fontSize: 14, color: Color(0xFF64748b)))),
                        )
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _filtered.length,
                          separatorBuilder: (_, __) => const Divider(height: 1, color: Color(0xFFf1f5f9)),
                          itemBuilder: (ctx, i) {
                            final s = _filtered[i];
                            return ListTile(
                              onTap: () => _openEdit(s),
                              leading: Container(
                                width: 36,
                                height: 36,
                                decoration: const BoxDecoration(color: Color(0xFFeef2ff), shape: BoxShape.circle),
                                child: Center(child: Text(s.name[0], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF6366f1)))),
                              ),
                              title: Text(s.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF1e293b))),
                              subtitle: Text(s.email, style: const TextStyle(fontSize: 12, color: Color(0xFF64748b))),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: s.enrolled ? const Color(0xFFf0fdf4) : const Color(0xFFf1f5f9),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      s.enrolled ? 'Active' : 'Inactive',
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: s.enrolled ? const Color(0xFF16a34a) : const Color(0xFF64748b)),
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFdc2626)),
                                    onPressed: () => _handleDelete(s.id),
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
                  child: Form(
                    key: _formKey,
                    child: SingleChildScrollView(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(width: 40, height: 5, decoration: BoxDecoration(color: const Color(0xFFd4d4d8), borderRadius: BorderRadius.circular(3))),
                          const SizedBox(height: 12),
                          Text(_editing != null ? 'Edit Student' : 'New Student', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Color(0xFF1e293b))),
                          const SizedBox(height: 4),
                          Text(_editing != null ? 'Update the student details below.' : 'Fill in the details to register a new student.',
                              style: const TextStyle(fontSize: 14, color: Color(0xFF64748b))),
                          const SizedBox(height: 20),
                          TextFormField(
                            controller: _nameCtrl,
                            decoration: _inputDec('Full name'),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(child: TextFormField(controller: _ageCtrl, keyboardType: TextInputType.number, decoration: _inputDec('Age'))),
                              const SizedBox(width: 10),
                              Expanded(child: TextFormField(controller: _gradeCtrl, decoration: _inputDec('Grade'))),
                            ],
                          ),
                          const SizedBox(height: 12),
                          TextFormField(controller: _emailCtrl, keyboardType: TextInputType.emailAddress, decoration: _inputDec('Email')),
                          const SizedBox(height: 12),
                          TextFormField(controller: _phoneCtrl, decoration: _inputDec('Phone')),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              const Text('Status:', style: TextStyle(fontSize: 14, color: Color(0xFF1e293b), fontWeight: FontWeight.w500)),
                              const SizedBox(width: 10),
                              ChoiceChip(
                                label: const Text('Active', style: TextStyle(fontSize: 12)),
                                selected: _enrolled,
                                onSelected: (_) => setState(() => _enrolled = true),
                                selectedColor: const Color(0xFFeef2ff),
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('Inactive', style: TextStyle(fontSize: 12)),
                                selected: !_enrolled,
                                onSelected: (_) => setState(() => _enrolled = false),
                                selectedColor: const Color(0xFFeef2ff),
                              ),
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
                    ),
                  ),
                );
                },
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
