import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class User {
  final String username;
  final String name;
  final String role;

  User({required this.username, required this.name, required this.role});

  Map<String, dynamic> toJson() => {
        'username': username,
        'name': name,
        'role': role,
      };

  factory User.fromJson(Map<String, dynamic> json) => User(
        username: json['username'] as String,
        name: json['name'] as String,
        role: json['role'] as String,
      );
}

const _tokenKey = '@portal_token';
const _userKey = '@portal_user';

const _users = [
  {'username': 'admin', 'password': 'admin', 'name': 'Administrator', 'role': 'admin', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-admin'},
  {'username': 'student', 'password': 'student123', 'name': 'Student User', 'role': 'student', 'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-student'},
];

Future<Map<String, dynamic>> login(String username, String password) async {
  for (final u in _users) {
    if (u['username'] == username && u['password'] == password) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, u['token'] as String);
      final userData = {'username': u['username'], 'name': u['name'], 'role': u['role']};
      await prefs.setString(_userKey, jsonEncode(userData));
      return {'success': true, 'user': User.fromJson(userData)};
    }
  }
  return {'success': false};
}

Future<void> logout() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove(_tokenKey);
  await prefs.remove(_userKey);
}

Future<User?> getStoredUser() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString(_userKey);
  final token = prefs.getString(_tokenKey);
  if (raw != null && token != null) {
    return User.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }
  return null;
}
