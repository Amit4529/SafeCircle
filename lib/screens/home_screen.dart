import 'package:flutter/material.dart';
import '../models/post.dart';
import '../widgets/post_card.dart';

class HomeScreen extends StatelessWidget {
  final List<Post> posts;
  final void Function(String postId) onUpvote;
  final void Function(String postId) onDownvote;

  const HomeScreen({
    super.key,
    required this.posts,
    required this.onUpvote,
    required this.onDownvote,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.only(top: 8, bottom: 88),
      itemCount: posts.length,
      itemBuilder: (context, i) {
        final p = posts[i];
        return PostCard(
          post: p,
          onUpvote: () => onUpvote(p.id),
          onDownvote: () => onDownvote(p.id),
        );
      },
    );
  }
}
