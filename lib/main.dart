import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:flutter/material.dart';
import 'models/post.dart';
import 'models/report.dart';
import 'screens/auth_screen.dart';
import 'screens/home_screen.dart';
import 'screens/report_screen.dart';
import 'screens/safety_screen.dart';
import 'screens/profile_screen.dart';
import 'theme.dart';
import 'services/face_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://yzbydqdvqgjoqnptcmuh.supabase.co',
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YnlkcWR2cWdqb3FucHRjbXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTUwMzgsImV4cCI6MjA3NTQ5MTAzOH0.5JMP9KPNaMBWqM2YUp0iXwU10hpgb0l8R043NnGB5Eg',
  );
  final faceService = FaceService();
  await faceService.loadModel();

  runApp(const SafeCircleApp());
}

class SafeCircleApp extends StatefulWidget {
  const SafeCircleApp({super.key});

  @override
  State<SafeCircleApp> createState() => _SafeCircleAppState();
}

class _SafeCircleAppState extends State<SafeCircleApp> {
  // Auth
  bool _loggedIn = false;
  String _anonId = 'Anon-0000';

  // Navigation
  int _currentIndex = 0;

  // Data (UI-only)
  final List<Post> _posts = [
    Post(
        id: 'p1',
        anonAuthorId: 'Anon-4821',
        content: 'Be cautious near 5th and Main.'),
    Post(
        id: 'p2',
        anonAuthorId: 'Anon-1933',
        content: 'Streetlights out near Park Ave.'),
  ];
  final List<Report> _myReports = [];

  void _onUpvote(String postId) {
    setState(() {
      final p = _posts.firstWhere((e) => e.id == postId);
      p.upvoted = !p.upvoted;
      if (p.upvoted) p.downvoted = false;
    });
  }

  void _onDownvote(String postId) {
    setState(() {
      final p = _posts.firstWhere((e) => e.id == postId);
      p.downvoted = !p.downvoted;
      if (p.downvoted) p.upvoted = false;
    });
  }

  void _onCreateReport({
    required String type,
    required String location,
    required String description,
  }) {
    final id = 'r${DateTime.now().millisecondsSinceEpoch}';
    final report = Report(
      id: id,
      type: type,
      location: location,
      description: description,
      ownerAnonId: _anonId,
      createdAt: DateTime.now(),
    );
    setState(() {
      _myReports.insert(0, report);
      // Also reflect into the feed as a post (anonymous)
      _posts.insert(
        0,
        Post(
          id: 'post_$id',
          anonAuthorId: _anonId,
          content: '$type at $location — $description',
        ),
      );
      _currentIndex = 0; // return to Home
    });
  }

  void _onDeleteReport(String reportId) {
    setState(() {
      _myReports.removeWhere((r) => r.id == reportId);
      // Remove corresponding generated feed post if present
      _posts.removeWhere((p) => p.id == 'post_$reportId');
    });
  }

  void _onSignedUp(String anonId) {
    setState(() {
      _anonId = anonId;
      _loggedIn = true;
      _currentIndex = 0;
    });
  }

  void _onLoggedIn() {
    setState(() {
      _loggedIn = true;
      _currentIndex = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SafeCircle',
      theme: AppTheme.theme,
      home: _loggedIn ? _buildMainScaffold() : _buildAuth(),
      debugShowCheckedModeBanner: false,
    );
  }

  Widget _buildAuth() {
    return AuthScreen(
      onSignedUp: _onSignedUp,
      onLoggedIn: _onLoggedIn,
    );
  }

  PreferredSizeWidget _buildAppBar() {
    const titles = ['Home', 'Report', 'Safety', 'Profile'];
    return AppBar(
      title: Text(titles[_currentIndex]),
    );
  }

  Widget _buildMainScaffold() {
    final screens = [
      HomeScreen(posts: _posts, onUpvote: _onUpvote, onDownvote: _onDownvote),
      ReportScreen(onCreateReport: _onCreateReport),
      const SafetyScreen(),
      ProfileScreen(
          anonId: _anonId,
          myReports: _myReports,
          onDeleteReport: _onDeleteReport),
    ];

    return Scaffold(
      appBar: _buildAppBar(),
      body: IndexedStack(index: _currentIndex, children: screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(
              icon: Icon(Icons.report_gmailerrorred), label: 'Report'),
          NavigationDestination(
              icon: Icon(Icons.security_rounded), label: 'Safety'),
          NavigationDestination(
              icon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}
