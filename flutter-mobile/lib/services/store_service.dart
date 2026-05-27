import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_mobile/models/student.dart';
import 'package:flutter_mobile/models/fee.dart';
import 'package:flutter_mobile/models/course.dart';
import 'package:flutter_mobile/models/test_model.dart';
import 'package:flutter_mobile/models/timetable.dart';
import 'package:flutter_mobile/data/students.dart' as data_students;
import 'package:flutter_mobile/data/fees.dart' as data_fees;
import 'package:flutter_mobile/data/courses.dart' as data_courses;
import 'package:flutter_mobile/data/tests.dart' as data_tests;
import 'package:flutter_mobile/data/timetable.dart' as data_timetable;

const _studentsKey = '@portal_students';
const _feesKey = '@portal_fees';

Future<void> initStore() async {
  final prefs = await SharedPreferences.getInstance();
  if (!prefs.containsKey(_studentsKey)) {
    prefs.setString(_studentsKey, jsonEncode(data_students.defaultStudents.map((s) => s.toJson()).toList()));
  }
  if (!prefs.containsKey(_feesKey)) {
    prefs.setString(_feesKey, jsonEncode(data_fees.defaultFees.map((f) => f.toJson()).toList()));
  }
}

Future<List<Student>> getStudents() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString(_studentsKey);
  if (raw == null) return data_students.defaultStudents;
  final list = jsonDecode(raw) as List;
  return list.map((e) => Student.fromJson(e as Map<String, dynamic>)).toList();
}

Future<Student> createStudent(Map<String, dynamic> data) async {
  final list = await getStudents();
  final id = (list.isEmpty ? 0 : list.map((s) => s.id).reduce((a, b) => a > b ? a : b)) + 1;
  final student = Student(id: id, name: data['name'], age: data['age'], grade: data['grade'], email: data['email'], phone: data['phone'], enrolled: data['enrolled']);
  list.add(student);
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_studentsKey, jsonEncode(list.map((s) => s.toJson()).toList()));
  return student;
}

Future<Student?> updateStudent(int id, Map<String, dynamic> data) async {
  final list = await getStudents();
  final idx = list.indexWhere((s) => s.id == id);
  if (idx == -1) return null;
  list[idx] = list[idx].copyWith(
    name: data['name'],
    age: data['age'],
    grade: data['grade'],
    email: data['email'],
    phone: data['phone'],
    enrolled: data['enrolled'],
  );
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_studentsKey, jsonEncode(list.map((s) => s.toJson()).toList()));
  return list[idx];
}

Future<bool> deleteStudent(int id) async {
  final list = await getStudents();
  final idx = list.indexWhere((s) => s.id == id);
  if (idx == -1) return false;
  list.removeAt(idx);
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_studentsKey, jsonEncode(list.map((s) => s.toJson()).toList()));
  return true;
}

Future<List<Fee>> getFees() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString(_feesKey);
  if (raw == null) return data_fees.defaultFees;
  final list = jsonDecode(raw) as List;
  return list.map((e) => Fee.fromJson(e as Map<String, dynamic>)).toList();
}

Future<Fee> createFee(Map<String, dynamic> data) async {
  final list = await getFees();
  final id = (list.isEmpty ? 0 : list.map((f) => f.id).reduce((a, b) => a > b ? a : b)) + 1;
  final fee = Fee(id: id, studentId: data['studentId'], studentName: data['studentName'], totalFees: data['totalFees'], paid: data['paid'], due: data['due'], status: data['status']);
  list.add(fee);
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_feesKey, jsonEncode(list.map((f) => f.toJson()).toList()));
  return fee;
}

Future<Fee?> updateFee(int id, Map<String, dynamic> data) async {
  final list = await getFees();
  final idx = list.indexWhere((f) => f.id == id);
  if (idx == -1) return null;
  list[idx] = list[idx].copyWith(
    studentId: data['studentId'],
    studentName: data['studentName'],
    totalFees: data['totalFees'],
    paid: data['paid'],
    due: data['due'],
    status: data['status'],
  );
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_feesKey, jsonEncode(list.map((f) => f.toJson()).toList()));
  return list[idx];
}

Future<bool> deleteFee(int id) async {
  final list = await getFees();
  final idx = list.indexWhere((f) => f.id == id);
  if (idx == -1) return false;
  list.removeAt(idx);
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_feesKey, jsonEncode(list.map((f) => f.toJson()).toList()));
  return true;
}

final List<Course> defaultCourses = data_courses.defaultCourses;
final List<TestModel> defaultTests = data_tests.defaultTests;
final List<DaySchedule> defaultTimetable = data_timetable.defaultTimetable;
