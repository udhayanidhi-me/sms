export function calculateKeralaGrade(total: number) {
  if (total >= 90) return { grade: "A+", gradePoint: 9.5, status: "PASSED" };
  if (total >= 80) return { grade: "A", gradePoint: 8.5, status: "PASSED" };
  if (total >= 70) return { grade: "B+", gradePoint: 7.5, status: "PASSED" };
  if (total >= 60) return { grade: "B", gradePoint: 6.5, status: "PASSED" };
  if (total >= 50) return { grade: "C+", gradePoint: 5.5, status: "PASSED" };
  if (total >= 40) return { grade: "C", gradePoint: 4.5, status: "PASSED" };
  return { grade: "F", gradePoint: 0.0, status: "FAILED" };
}
