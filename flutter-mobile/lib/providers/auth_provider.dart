import 'package:flutter/material.dart';
import 'package:flutter_mobile/services/auth_service.dart' as auth_service;
import 'package:flutter_mobile/services/auth_service.dart' show User;

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _loading = true;

  User? get user => _user;
  bool get loading => _loading;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _init();
  }

  Future<void> _init() async {
    _user = await auth_service.getStoredUser();
    _loading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    final result = await auth_service.login(username, password);
    if (result['success'] == true) {
      _user = result['user'] as User;
      notifyListeners();
    }
    return result;
  }

  Future<void> logout() async {
    await auth_service.logout();
    _user = null;
    notifyListeners();
  }
}
