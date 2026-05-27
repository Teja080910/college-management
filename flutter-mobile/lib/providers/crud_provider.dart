import 'package:flutter/foundation.dart';

class CrudProvider extends ChangeNotifier {
  int _refreshKey = 0;

  int get refreshKey => _refreshKey;

  void refresh() {
    _refreshKey++;
    notifyListeners();
  }
}
