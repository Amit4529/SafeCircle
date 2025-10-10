import 'package:flutter/material.dart';
import '../models/report.dart';

class ProfileScreen extends StatelessWidget {
  final String anonId;
  final List<Report> myReports;
  final void Function(String reportId) onDeleteReport;

  const ProfileScreen({
    super.key,
    required this.anonId,
    required this.myReports,
    required this.onDeleteReport,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(top: 8, bottom: 88),
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              const CircleAvatar(radius: 24, child: Icon(Icons.person)),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Your Anonymous ID',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.black54)),
                  Text(anonId, style: Theme.of(context).textTheme.titleMedium),
                ],
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text('Your Reports',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
        ),
        const SizedBox(height: 8),
        ...myReports.map(
          (r) => Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: ListTile(
              title: Text('${r.type} — ${r.location}'),
              subtitle: Text(r.description, maxLines: 2, overflow: TextOverflow.ellipsis),
              trailing: IconButton(
                onPressed: () => onDeleteReport(r.id),
                icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                tooltip: 'Delete',
              ),
            ),
          ),
        ),
        if (myReports.isEmpty)
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text('No reports yet.'),
          ),
      ],
    );
  }
}
