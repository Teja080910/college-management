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

const _authData = {
  'user': {'username': 'admin', 'name': 'Administrator', 'role': 'Admin'},
  'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
};

Future<Map<String, dynamic>> login(String username, String password) async {
  if (username == 'admin' && password == 'admin') {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, _authData['token'] as String);
    await prefs.setString(_userKey, jsonEncode(_authData['user']));
    return {
      'success': true,
      'user': User.fromJson(_authData['user'] as Map<String, dynamic>),
    };
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
