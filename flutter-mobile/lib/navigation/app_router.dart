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

class MainTabs extends StatelessWidget {
  const MainTabs({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 6,
      child: Scaffold(
        body: TabBarView(
          children: const [
            DashboardScreen(),
            StudentsScreen(),
            FeesScreen(),
            TimetableScreen(),
            CoursesScreen(),
            TestsScreen(),
          ],
        ),
        bottomNavigationBar: Consumer<AuthProvider>(
          builder: (ctx, auth, _) => Container(
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
              child: TabBar(
                indicatorColor: Colors.transparent,
                labelColor: const Color(0xFF6366f1),
                unselectedLabelColor: const Color(0xFF94a3b8),
                labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.3),
                unselectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.3),
                tabs: const [
                  _TabItem(icon: Icons.dashboard, label: 'Dashboard'),
                  _TabItem(icon: Icons.group, label: 'Students'),
                  _TabItem(icon: Icons.currency_rupee, label: 'Fees'),
                  _TabItem(icon: Icons.calendar_month, label: 'Timetable'),
                  _TabItem(icon: Icons.menu_book, label: 'Courses'),
                  _TabItem(icon: Icons.assignment, label: 'Tests'),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TabItem extends StatelessWidget {
  final IconData icon;
  final String label;

  const _TabItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Tab(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(height: 8),
          Icon(icon, size: 22),
          SizedBox(height: 2),
          Text(label, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 4),
        ],
      ),
    );
  }
}
