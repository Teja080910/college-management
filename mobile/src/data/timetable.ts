export interface Period {
  time: string
  subject: string
  faculty: string
}

export interface DaySchedule {
  day: string
  periods: Period[]
}

export const defaultTimetable: DaySchedule[] = [
  { day: "Monday", periods: [
    { time: "08:00 - 09:00", subject: "Mathematics", faculty: "Dr. Adams" },
    { time: "09:00 - 10:00", subject: "Physics", faculty: "Prof. Baker" },
    { time: "10:15 - 11:15", subject: "Chemistry", faculty: "Dr. Clark" },
    { time: "11:15 - 12:15", subject: "Computer Science", faculty: "Prof. Davis" },
  ]},
  { day: "Tuesday", periods: [
    { time: "08:00 - 09:00", subject: "Physics", faculty: "Prof. Baker" },
    { time: "09:00 - 10:00", subject: "Mathematics", faculty: "Dr. Adams" },
    { time: "10:15 - 11:15", subject: "English", faculty: "Ms. Evans" },
    { time: "11:15 - 12:15", subject: "Chemistry Lab", faculty: "Dr. Clark" },
  ]},
  { day: "Wednesday", periods: [
    { time: "08:00 - 09:00", subject: "Computer Science", faculty: "Prof. Davis" },
    { time: "09:00 - 10:00", subject: "Mathematics", faculty: "Dr. Adams" },
    { time: "10:15 - 11:15", subject: "Physics Lab", faculty: "Prof. Baker" },
    { time: "11:15 - 12:15", subject: "English", faculty: "Ms. Evans" },
  ]},
  { day: "Thursday", periods: [
    { time: "08:00 - 09:00", subject: "Chemistry", faculty: "Dr. Clark" },
    { time: "09:00 - 10:00", subject: "Computer Science", faculty: "Prof. Davis" },
    { time: "10:15 - 11:15", subject: "Mathematics", faculty: "Dr. Adams" },
    { time: "11:15 - 12:15", subject: "Physics", faculty: "Prof. Baker" },
  ]},
  { day: "Friday", periods: [
    { time: "08:00 - 09:00", subject: "English", faculty: "Ms. Evans" },
    { time: "09:00 - 10:00", subject: "Chemistry", faculty: "Dr. Clark" },
    { time: "10:15 - 11:15", subject: "Computer Science Lab", faculty: "Prof. Davis" },
    { time: "11:15 - 12:15", subject: "Mathematics", faculty: "Dr. Adams" },
  ]},
]
