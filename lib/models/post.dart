class Post {
  final String id;
  final String anonAuthorId; // e.g., "Anon-4821"
  final String content;
  bool upvoted;
  bool downvoted;

  Post({
    required this.id,
    required this.anonAuthorId,
    required this.content,
    this.upvoted = false,
    this.downvoted = false,
  });
}
