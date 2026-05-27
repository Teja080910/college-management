import 'package:flutter_mobile/models/timetable.dart';

final List<DaySchedule> defaultTimetable = [
  DaySchedule(day: "Monday", periods: [
    Period(time: "08:00 - 09:00", subject: "Mathematics", faculty: "Dr. Adams"),
    Period(time: "09:00 - 10:00", subject: "Physics", faculty: "Prof. Baker"),
    Period(time: "10:15 - 11:15", subject: "Chemistry", faculty: "Dr. Clark"),
    Period(time: "11:15 - 12:15", subject: "Computer Science", faculty: "Prof. Davis"),
  ]),
  DaySchedule(day: "Tuesday", periods: [
    Period(time: "08:00 - 09:00", subject: "Physics", faculty: "Prof. Baker"),
    Period(time: "09:00 - 10:00", subject: "Mathematics", faculty: "Dr. Adams"),
    Period(time: "10:15 - 11:15", subject: "English", faculty: "Ms. Evans"),
    Period(time: "11:15 - 12:15", subject: "Chemistry Lab", faculty: "Dr. Clark"),
  ]),
  DaySchedule(day: "Wednesday", periods: [
    Period(time: "08:00 - 09:00", subject: "Computer Science", faculty: "Prof. Davis"),
    Period(time: "09:00 - 10:00", subject: "Mathematics", faculty: "Dr. Adams"),
    Period(time: "10:15 - 11:15", subject: "Physics Lab", faculty: "Prof. Baker"),
    Period(time: "11:15 - 12:15", subject: "English", faculty: "Ms. Evans"),
  ]),
  DaySchedule(day: "Thursday", periods: [
    Period(time: "08:00 - 09:00", subject: "Chemistry", faculty: "Dr. Clark"),
    Period(time: "09:00 - 10:00", subject: "Computer Science", faculty: "Prof. Davis"),
    Period(time: "10:15 - 11:15", subject: "Mathematics", faculty: "Dr. Adams"),
    Period(time: "11:15 - 12:15", subject: "Physics", faculty: "Prof. Baker"),
  ]),
  DaySchedule(day: "Friday", periods: [
    Period(time: "08:00 - 09:00", subject: "English", faculty: "Ms. Evans"),
    Period(time: "09:00 - 10:00", subject: "Chemistry", faculty: "Dr. Clark"),
    Period(time: "10:15 - 11:15", subject: "Computer Science Lab", faculty: "Prof. Davis"),
    Period(time: "11:15 - 12:15", subject: "Mathematics", faculty: "Dr. Adams"),
  ]),
];
