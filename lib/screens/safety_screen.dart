import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/safety_tips.dart';

class SafetyScreen extends StatelessWidget {
  const SafetyScreen({super.key});

  void _showSnack(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(bottom: 88),
      children: [
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentRed,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => _showSnack(context, 'SOS triggered (UI only)'),
                  icon: const Icon(Icons.warning_amber_rounded),
                  label: const Text('SOS'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => _showSnack(context, 'Sharing live location (UI only)'),
                  icon: const Icon(Icons.my_location_rounded),
                  label: const Text('Share Location'),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => _showSnack(context, 'Calling emergency contact (UI only)'),
            icon: const Icon(Icons.phone_in_talk_rounded),
            label: const Text('Call Emergency Contact'),
          ),
        ),
        const SizedBox(height: 8),
        const SafetyTips(),
      ],
    );
  }
}
