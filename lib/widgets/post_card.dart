import 'package:flutter/material.dart';
import '../models/post.dart';
import '../theme.dart';

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback onUpvote;
  final VoidCallback onDownvote;

  const PostCard({
    super.key,
    required this.post,
    required this.onUpvote,
    required this.onDownvote,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppTheme.surface,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Anonymous author only; do not show name/pin
            Row(
              children: [
                CircleAvatar(
                  radius: 14,
                  backgroundColor: Colors.grey.shade200,
                  child: const Icon(Icons.person, size: 16, color: Colors.black54),
                ),
                const SizedBox(width: 8),
                Text(
                  post.anonAuthorId,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              post.content,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    height: 1.5,
                    color: Colors.black87,
                  ),
            ),
            const SizedBox(height: 12),
            // Actions: Upvote/Downvote without showing score
            Row(
              children: [
                _ActionChip(
                  icon: Icons.arrow_upward_rounded,
                  label: 'Upvote',
                  active: post.upvoted,
                  onTap: onUpvote,
                ),
                const SizedBox(width: 12),
                _ActionChip(
                  icon: Icons.arrow_downward_rounded,
                  label: 'Downvote',
                  active: post.downvoted,
                  onTap: onDownvote,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _ActionChip({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color base = active ? AppTheme.primaryBlue : Colors.grey.shade200;
    final Color fg = active ? Colors.white : Colors.black87;

    return Material(
      color: base,
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: [
              Icon(icon, size: 18, color: fg),
              const SizedBox(width: 6),
              Text(label, style: TextStyle(color: fg, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}
