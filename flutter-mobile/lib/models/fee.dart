class Fee {
  final int id;
  final int studentId;
  final String studentName;
  final int totalFees;
  final int paid;
  final int due;
  final String status;

  Fee({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.totalFees,
    required this.paid,
    required this.due,
    required this.status,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'studentId': studentId,
        'studentName': studentName,
        'totalFees': totalFees,
        'paid': paid,
        'due': due,
        'status': status,
      };

  factory Fee.fromJson(Map<String, dynamic> json) => Fee(
        id: json['id'] as int,
        studentId: json['studentId'] as int,
        studentName: json['studentName'] as String,
        totalFees: json['totalFees'] as int,
        paid: json['paid'] as int,
        due: json['due'] as int,
        status: json['status'] as String,
      );

  Fee copyWith({
    int? id,
    int? studentId,
    String? studentName,
    int? totalFees,
    int? paid,
    int? due,
    String? status,
  }) =>
      Fee(
        id: id ?? this.id,
        studentId: studentId ?? this.studentId,
        studentName: studentName ?? this.studentName,
        totalFees: totalFees ?? this.totalFees,
        paid: paid ?? this.paid,
        due: due ?? this.due,
        status: status ?? this.status,
      );
}
