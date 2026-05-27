import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_mobile/providers/auth_provider.dart';
import 'package:flutter_mobile/providers/crud_provider.dart';
import 'package:flutter_mobile/navigation/app_router.dart';
import 'package:flutter_mobile/services/store_service.dart' as store;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await store.initStore();
  runApp(const StudentPortalApp());
}

class StudentPortalApp extends StatelessWidget {
  const StudentPortalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CrudProvider()),
      ],
      child: MaterialApp(
        title: 'Student Portal',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorSchemeSeed: const Color(0xFF6366f1),
          scaffoldBackgroundColor: const Color(0xFFf8fafc),
          fontFamily: 'Roboto',
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
        ),
        home: const AuthGate(),
      ),
    );
  }
}
