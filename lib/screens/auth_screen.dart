import 'package:flutter/material.dart';
import '../theme.dart';

class AuthScreen extends StatefulWidget {
  final void Function(String anonId) onSignedUp;
  final VoidCallback onLoggedIn;

  const AuthScreen({super.key, required this.onSignedUp, required this.onLoggedIn});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  final _loginPhoneCtrl = TextEditingController(text: '+91');
  final _signupPhoneCtrl = TextEditingController(text: '+91');
  bool _faceVerified = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _loginPhoneCtrl.dispose();
    _signupPhoneCtrl.dispose();
    super.dispose();
  }

  String _generateAnonId() {
    final r = (1000 + (DateTime.now().millisecondsSinceEpoch % 9000)).toString();
    return 'Anon-$r';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(
        title: const Text('SafeCircle'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryBlue,
          unselectedLabelColor: Colors.black54,
          tabs: const [
            Tab(text: 'Login'),
            Tab(text: 'Sign Up'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildLogin(context),
          _buildSignup(context),
        ],
      ),
    );
  }

  Widget _buildLogin(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Welcome back',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        TextField(
          controller: _loginPhoneCtrl,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(
            labelText: 'Phone Number (+91)',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        ElevatedButton(
          onPressed: widget.onLoggedIn,
          child: const Text('Login'),
        ),
      ],
    );
  }

  Widget _buildSignup(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Create your account',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        TextField(
          controller: _signupPhoneCtrl,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(
            labelText: 'Phone Number (+91)',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        // Mandatory face verification (mock)
        OutlinedButton.icon(
          onPressed: () async {
            // Mock verification flow — UI only
            await showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                title: const Text('Face Verification'),
                content: const Text(
                    'This is a mock verification for UI preview. No data is captured.'),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                  FilledButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Verify'),
                  ),
                ],
              ),
            );
            setState(() => _faceVerified = true);
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Face verification complete')),
              );
            }
          },
          icon: const Icon(Icons.face_retouching_natural_rounded),
          label: Text(_faceVerified ? 'Verified' : 'Verify Face'),
        ),
        const SizedBox(height: 12),
        ElevatedButton(
          onPressed: _faceVerified
              ? () {
                  final anon = _generateAnonId();
                  widget.onSignedUp(anon);
                }
              : null,
          child: const Text('Sign Up'),
        ),
        if (!_faceVerified)
          const Padding(
            padding: EdgeInsets.only(top: 8),
            child: Text(
              'Sign up requires face verification.',
              style: TextStyle(color: Colors.redAccent),
            ),
          ),
      ],
    );
  }
}
