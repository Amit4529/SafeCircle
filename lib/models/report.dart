class Report {
  final String id;
  final String type;
  final String location;
  final String description;
  final DateTime createdAt;
  final String ownerAnonId;

  Report({
    required this.id,
    required this.type,
    required this.location,
    required this.description,
    required this.ownerAnonId,
    required this.createdAt,
  });
}
