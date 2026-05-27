class Student {
  final int id;
  final String name;
  final int age;
  final String grade;
  final String email;
  final String phone;
  final bool enrolled;

  Student({
    required this.id,
    required this.name,
    required this.age,
    required this.grade,
    required this.email,
    required this.phone,
    required this.enrolled,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'age': age,
        'grade': grade,
        'email': email,
        'phone': phone,
        'enrolled': enrolled,
      };

  factory Student.fromJson(Map<String, dynamic> json) => Student(
        id: json['id'] as int,
        name: json['name'] as String,
        age: json['age'] as int,
        grade: json['grade'] as String,
        email: json['email'] as String,
        phone: json['phone'] as String,
        enrolled: json['enrolled'] as bool,
      );

  Student copyWith({
    int? id,
    String? name,
    int? age,
    String? grade,
    String? email,
    String? phone,
    bool? enrolled,
  }) =>
      Student(
        id: id ?? this.id,
        name: name ?? this.name,
        age: age ?? this.age,
        grade: grade ?? this.grade,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        enrolled: enrolled ?? this.enrolled,
      );
}
