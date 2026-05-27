class Period {
  final String time;
  final String subject;
  final String faculty;

  Period({
    required this.time,
    required this.subject,
    required this.faculty,
  });
}

class DaySchedule {
  final String day;
  final List<Period> periods;

  DaySchedule({
    required this.day,
    required this.periods,
  });
}
