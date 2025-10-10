import 'package:flutter/material.dart';

class ReportScreen extends StatefulWidget {
  final void Function({
    required String type,
    required String location,
    required String description,
  }) onCreateReport;

  const ReportScreen({super.key, required this.onCreateReport});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final _formKey = GlobalKey<FormState>();
  String _type = 'Harassment';
  final _locationCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  late int _a;
  late int _b;
  final _captchaCtrl = TextEditingController();
  bool _consented = false; // used in dialog flow

  @override
  void initState() {
    super.initState();
    _generateCaptcha();
  }

  void _generateCaptcha() {
    _a = 2 + (DateTime.now().second % 7); // simple, reproducible
    _b = 1 + (DateTime.now().millisecond % 9);
  }

  @override
  void dispose() {
    _locationCtrl.dispose();
    _descCtrl.dispose();
    _captchaCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final answer = int.tryParse(_captchaCtrl.text.trim());
    if (answer != _a + _b) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Captcha incorrect')));
      return;
    }

    _consented = false;
    await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Share Report'),
        content: const Text(
          'Do you consent to share this report to the community feed?',
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              _consented = true;
              Navigator.pop(ctx);
            },
            child: const Text('Confirm & Share'),
          ),
        ],
      ),
    );

    if (!_consented) return;

    widget.onCreateReport(
      type: _type,
      location: _locationCtrl.text.trim(),
      description: _descCtrl.text.trim(),
    );

    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Report shared')));
    // Clear form and rotate captcha
    _formKey.currentState!.reset();
    _locationCtrl.clear();
    _descCtrl.clear();
    _captchaCtrl.clear();
    setState(_generateCaptcha);
  }

  @override
  Widget build(BuildContext context) {
    final types = ['Harassment', 'Unsafe Area', 'Suspicious Activity', 'Other'];

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            initialValue: _type,
            items: types
                .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                .toList(),
            onChanged: (v) => setState(() => _type = v ?? _type),
            decoration: const InputDecoration(
              labelText: 'Issue Type',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _locationCtrl,
            decoration: const InputDecoration(
              labelText: 'Location',
              border: OutlineInputBorder(),
            ),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Required' : null,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _descCtrl,
            minLines: 3,
            maxLines: 6,
            decoration: const InputDecoration(
              labelText: 'Description',
              border: OutlineInputBorder(),
            ),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Required' : null,
          ),
          const SizedBox(height: 12),
          // Simple captcha
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _captchaCtrl,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Captcha: $_a + $_b = ?',
                    border: const OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Required' : null,
                ),
              ),
              IconButton(
                tooltip: 'Refresh',
                onPressed: () => setState(_generateCaptcha),
                icon: const Icon(Icons.refresh),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _submit,
            icon: const Icon(Icons.send_rounded),
            label: const Text('Submit Report'),
          ),
        ],
      ),
    );
  }
}
