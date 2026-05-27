import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_mobile/providers/auth_provider.dart';
import 'package:flutter_mobile/screens/login_screen.dart';
import 'package:flutter_mobile/screens/dashboard_screen.dart';
import 'package:flutter_mobile/screens/students_screen.dart';
import 'package:flutter_mobile/screens/fees_screen.dart';
import 'package:flutter_mobile/screens/timetable_screen.dart';
import 'package:flutter_mobile/screens/courses_screen.dart';
import 'package:flutter_mobile/screens/tests_screen.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (auth.loading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF6366f1)),
        ),
      );
    }
    return auth.isAuthenticated ? const MainTabs() : const LoginScreen();
  }
}

class MainTabs extends StatefulWidget {
  const MainTabs({super.key});

  @override
  State<MainTabs> createState() => _MainTabsState();
}

class _MainTabsState extends State<MainTabs> {
  int _selectedIndex = 0;

  static const _screens = <Widget>[
    DashboardScreen(),
    StudentsScreen(),
    FeesScreen(),
    TimetableScreen(),
    CoursesScreen(),
    TestsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF6366f1).withOpacity(0.12),
              blurRadius: 16,
              offset: const Offset(0, -6),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: BottomNavigationBar(
              currentIndex: _selectedIndex,
              onTap: (i) => setState(() => _selectedIndex = i),
              type: BottomNavigationBarType.fixed,
              backgroundColor: Colors.transparent,
              selectedItemColor: const Color(0xFF6366f1),
              unselectedItemColor: const Color(0xFF94a3b8),
              selectedFontSize: 11,
              unselectedFontSize: 11,
              selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, letterSpacing: 0.3),
              unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, letterSpacing: 0.3),
              iconSize: 26,
              elevation: 0,
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
                BottomNavigationBarItem(icon: Icon(Icons.group_outlined), activeIcon: Icon(Icons.group), label: 'Students'),
                BottomNavigationBarItem(icon: Icon(Icons.currency_rupee_outlined), activeIcon: Icon(Icons.currency_rupee), label: 'Fees'),
                BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), activeIcon: Icon(Icons.calendar_month), label: 'Timetable'),
                BottomNavigationBarItem(icon: Icon(Icons.menu_book_outlined), activeIcon: Icon(Icons.menu_book), label: 'Courses'),
                BottomNavigationBarItem(icon: Icon(Icons.assignment_outlined), activeIcon: Icon(Icons.assignment), label: 'Tests'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
