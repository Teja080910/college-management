export interface Fee {
  id: number
  studentId: number
  studentName: string
  totalFees: number
  paid: number
  due: number
  status: 'paid' | 'partial' | 'unpaid'
}

export const defaultFees: Fee[] = [
  { id: 1, studentId: 1, studentName: "Alice Johnson", totalFees: 50000, paid: 35000, due: 15000, status: "partial" },
  { id: 2, studentId: 2, studentName: "Bob Smith", totalFees: 50000, paid: 50000, due: 0, status: "paid" },
  { id: 3, studentId: 3, studentName: "Carol White", totalFees: 45000, paid: 10000, due: 35000, status: "partial" },
  { id: 4, studentId: 4, studentName: "David Brown", totalFees: 50000, paid: 0, due: 50000, status: "unpaid" },
  { id: 5, studentId: 5, studentName: "Eve Davis", totalFees: 55000, paid: 55000, due: 0, status: "paid" },
]
