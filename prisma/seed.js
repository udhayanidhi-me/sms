const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for MGCSIILS Student Management System...");

  // 1. Clear existing data
  await prisma.paymentReceipt.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.feeStructure.deleteMany({});
  await prisma.examResult.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.attendanceEntry.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.courseAllocation.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.facultyProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.notice.deleteMany({});

  // 2. Department
  const lawDept = await prisma.department.create({
    data: {
      name: "Faculty of Law",
      code: "LAW",
    },
  });

  // 3. Programs
  const baLlb = await prisma.program.create({
    data: {
      name: "5-Year Integrated B.A. LL.B.",
      code: "BALLB",
      durationYears: 5,
      totalSemesters: 10,
      departmentId: lawDept.id,
    },
  });

  const bcomLlb = await prisma.program.create({
    data: {
      name: "5-Year Integrated B.Com. LL.B.",
      code: "BCOMLLB",
      durationYears: 5,
      totalSemesters: 10,
      departmentId: lawDept.id,
    },
  });

  const bbaLlb = await prisma.program.create({
    data: {
      name: "5-Year Integrated BBA LL.B.",
      code: "BBALLB",
      durationYears: 5,
      totalSemesters: 10,
      departmentId: lawDept.id,
    },
  });

  const llb3Yr = await prisma.program.create({
    data: {
      name: "3-Year Unitary LL.B.",
      code: "LLB",
      durationYears: 3,
      totalSemesters: 6,
      departmentId: lawDept.id,
    },
  });

  const llm = await prisma.program.create({
    data: {
      name: "2-Year LL.M. (Constitutional Law)",
      code: "LLM",
      durationYears: 2,
      totalSemesters: 4,
      departmentId: lawDept.id,
    },
  });

  // 4. Courses for B.A. LL.B. Semester 1
  const courseEnglish = await prisma.course.create({
    data: {
      code: "EN 1121",
      name: "English Language Skills",
      credits: 4,
      semester: 1,
      programId: baLlb.id,
      caMaxMarks: 25.0,
      esaMaxMarks: 75.0,
    },
  });

  const coursePolSci = await prisma.course.create({
    data: {
      code: "PS 1101",
      name: "Principles of Political Science",
      credits: 4,
      semester: 1,
      programId: baLlb.id,
      caMaxMarks: 25.0,
      esaMaxMarks: 75.0,
    },
  });

  const courseSoc = await prisma.course.create({
    data: {
      code: "SO 1101",
      name: "Principles of Sociology",
      credits: 4,
      semester: 1,
      programId: baLlb.id,
      caMaxMarks: 25.0,
      esaMaxMarks: 75.0,
    },
  });

  const courseTorts = await prisma.course.create({
    data: {
      code: "LC 1101",
      name: "Law of Torts and Motor Vehicles Act",
      credits: 4,
      semester: 1,
      programId: baLlb.id,
      caMaxMarks: 25.0,
      esaMaxMarks: 75.0,
    },
  });

  const courseContracts = await prisma.course.create({
    data: {
      code: "LC 1102",
      name: "General Principles of Contract",
      credits: 4,
      semester: 1,
      programId: baLlb.id,
      caMaxMarks: 25.0,
      esaMaxMarks: 75.0,
    },
  });

  // 5. Users: Admin, Faculty, Students
  const defaultPassword = await bcrypt.hash("Password@123", 10);

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "Principal & Academic Office",
      role: "ADMIN",
    },
  });

  // Faculty 1
  const facultyUser1 = await prisma.user.create({
    data: {
      email: "anand.kumar@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "Prof. Adv. Anand Kumar",
      role: "FACULTY",
    },
  });

  const faculty1 = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser1.id,
      employeeCode: "FAC-1001",
      designation: "Associate Professor of Law",
      department: "Law",
      qualification: "LL.M., Ph.D., UGC-NET",
      phone: "+91 94471 23456",
    },
  });

  // Faculty 2
  const facultyUser2 = await prisma.user.create({
    data: {
      email: "meera.nair@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "Dr. Meera Nair",
      role: "FACULTY",
    },
  });

  const faculty2 = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser2.id,
      employeeCode: "FAC-1002",
      designation: "Assistant Professor of Social Sciences",
      department: "Humanities",
      qualification: "M.A. Political Science, Ph.D.",
      phone: "+91 94472 34567",
    },
  });

  // Course allocations
  await prisma.courseAllocation.createMany({
    data: [
      { courseId: courseTorts.id, facultyId: faculty1.id, academicYear: "2026-2027" },
      { courseId: courseContracts.id, facultyId: faculty1.id, academicYear: "2026-2027" },
      { courseId: coursePolSci.id, facultyId: faculty2.id, academicYear: "2026-2027" },
    ],
  });

  // Students
  const student1User = await prisma.user.create({
    data: {
      email: "siva.govind@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "SIVA GOVIND V",
      role: "STUDENT",
    },
  });

  const student1 = await prisma.studentProfile.create({
    data: {
      userId: student1User.id,
      candidateCode: "47320105",
      registrationNo: "KER-2023-BALLB-042",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      section: "A",
      gender: "Male",
      dob: new Date("2005-04-12"),
      phone: "+91 98470 11223",
      address: "Parassala P.O., Thiruvananthapuram, Kerala - 695502",
      guardianName: "Vijayakumar P",
      guardianPhone: "+91 94470 99887",
      status: "ACTIVE",
    },
  });

  const student2User = await prisma.user.create({
    data: {
      email: "ananya.krishna@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "ANANYA KRISHNA",
      role: "STUDENT",
    },
  });

  const student2 = await prisma.studentProfile.create({
    data: {
      userId: student2User.id,
      candidateCode: "47320106",
      registrationNo: "KER-2023-BALLB-043",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      section: "A",
      gender: "Female",
      dob: new Date("2005-08-20"),
      phone: "+91 98471 22334",
      address: "Neyyattinkara, Thiruvananthapuram, Kerala - 695121",
      guardianName: "Krishnakumar S",
      guardianPhone: "+91 94473 88776",
      status: "ACTIVE",
    },
  });

  const student3User = await prisma.user.create({
    data: {
      email: "rahul.mathew@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      name: "RAHUL MATHEW",
      role: "STUDENT",
    },
  });

  const student3 = await prisma.studentProfile.create({
    data: {
      userId: student3User.id,
      candidateCode: "47320107",
      registrationNo: "KER-2023-BALLB-044",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      section: "A",
      gender: "Male",
      dob: new Date("2004-11-15"),
      phone: "+91 98472 33445",
      address: "Cheruvarakonam, Parassala, Kerala - 695502",
      guardianName: "Mathew George",
      guardianPhone: "+91 94475 77665",
      status: "ACTIVE",
    },
  });

  // 6. Attendance records (10 days)
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - i);

    const record = await prisma.attendanceRecord.create({
      data: {
        programId: baLlb.id,
        semester: 1,
        section: "A",
        date: recordDate,
        period: 1,
        recordedBy: facultyUser1.name,
      },
    });

    // Student 1: 90% (absent once on i=5)
    // Student 2: 80% (absent on i=3, i=7)
    // Student 3: 60% (absent on i=1, i=3, i=6, i=8) -> Shortage trigger (<75%)
    await prisma.attendanceEntry.createMany({
      data: [
        {
          attendanceRecordId: record.id,
          studentId: student1.id,
          status: i === 5 ? "ABSENT" : "PRESENT",
        },
        {
          attendanceRecordId: record.id,
          studentId: student2.id,
          status: i === 3 || i === 7 ? "ABSENT" : "PRESENT",
        },
        {
          attendanceRecordId: record.id,
          studentId: student3.id,
          status: [1, 3, 6, 8].includes(i) ? "ABSENT" : "PRESENT",
          remarks: [1, 3, 6, 8].includes(i) ? "Uninformed absence" : null,
        },
      ],
    });
  }

  // 7. Exam & Results
  const exam = await prisma.exam.create({
    data: {
      title: "First Semester Integrated B.A. LL.B. Degree Examination",
      examCode: "47320105",
      programId: baLlb.id,
      semester: 1,
      monthYear: "November 2026",
      academicYear: "2026-2027",
      status: "PUBLISHED",
    },
  });

  // Grading helper
  function calculateGrade(total) {
    if (total >= 90) return { grade: "A+", gp: 9.5 };
    if (total >= 80) return { grade: "A", gp: 8.5 };
    if (total >= 70) return { grade: "B+", gp: 7.5 };
    if (total >= 60) return { grade: "B", gp: 6.5 };
    if (total >= 50) return { grade: "C+", gp: 5.5 };
    if (total >= 40) return { grade: "C", gp: 4.5 };
    return { grade: "F", gp: 0.0 };
  }

  const courses = [courseEnglish, coursePolSci, courseSoc, courseTorts, courseContracts];
  const marksData = [
    { student: student1, ca: 23, esa: 65 }, // Total 88 (A)
    { student: student2, ca: 21, esa: 58 }, // Total 79 (B+)
    { student: student3, ca: 18, esa: 48 }, // Total 66 (B)
  ];

  for (const item of marksData) {
    for (const c of courses) {
      const ca = item.ca + (Math.random() > 0.5 ? 1 : -1);
      const esa = item.esa + (Math.random() > 0.5 ? 2 : -2);
      const total = ca + esa;
      const { grade, gp } = calculateGrade(total);

      await prisma.examResult.create({
        data: {
          examId: exam.id,
          studentId: item.student.id,
          courseId: c.id,
          caMark: ca,
          esaMark: esa,
          totalMark: total,
          gradePoint: gp,
          grade: grade,
          status: total >= 40 ? "PASSED" : "FAILED",
        },
      });
    }
  }

  // 8. Fee Structures & Invoices
  const feeStructure = await prisma.feeStructure.create({
    data: {
      programId: baLlb.id,
      semester: 1,
      title: "Semester 1 Tuition & Institutional Amenities Fee",
      tuitionFee: 32000,
      specialFee: 5000,
      libraryFee: 3500,
      examFee: 2000,
      totalAmount: 42500,
    },
  });

  // Invoice 1: Paid Full
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00101",
      studentId: student1.id,
      feeStructureId: feeStructure.id,
      totalAmount: 42500,
      paidAmount: 42500,
      status: "PAID",
      dueDate: new Date("2026-12-15"),
    },
  });

  await prisma.paymentReceipt.create({
    data: {
      receiptNo: "REC-2026-9001",
      invoiceId: inv1.id,
      amount: 42500,
      paymentMethod: "UPI",
      transactionRef: "UPI/332155490123",
    },
  });

  // Invoice 2: Partially Paid
  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00102",
      studentId: student2.id,
      feeStructureId: feeStructure.id,
      totalAmount: 42500,
      paidAmount: 25000,
      status: "PARTIAL",
      dueDate: new Date("2026-12-15"),
    },
  });

  await prisma.paymentReceipt.create({
    data: {
      receiptNo: "REC-2026-9002",
      invoiceId: inv2.id,
      amount: 25000,
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "NEFT-SBIN202688741",
    },
  });

  // Invoice 3: Pending
  await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00103",
      studentId: student3.id,
      feeStructureId: feeStructure.id,
      totalAmount: 42500,
      paidAmount: 0,
      status: "PENDING",
      dueDate: new Date("2026-12-15"),
    },
  });

  // 9. Notices
  await prisma.notice.createMany({
    data: [
      {
        title: "Campus Health & Medical First-Aid Protocol Update",
        content:
          "In compliance with safety recommendations, the administration has established a dedicated First-Aid & Emergency Response Room equipped with on-call transport assistance at the Main Administrative Block.",
        category: "GENERAL",
        targetRole: "ALL",
        authorName: "Office of the Principal",
        isPinned: true,
      },
      {
        title: "University Exam Registration & Hall Ticket Issuance (Nov 2026)",
        content:
          "All First Semester B.A. LL.B., B.Com. LL.B., and BBA LL.B. students must verify their subject registrations before Nov 20, 2026. Hall tickets will be issued through the portal.",
        category: "EXAM",
        targetRole: "STUDENT",
        authorName: "Controller of Examinations",
        isPinned: true,
      },
      {
        title: "Faculty Moderation Committee Meeting for Continuous Assessment",
        content:
          "All Law Faculty members are requested to complete CA mark entries for Semester 1 subjects before 4:00 PM this Friday for moderation.",
        category: "ACADEMIC",
        targetRole: "FACULTY",
        authorName: "Dean of Academic Affairs",
        isPinned: false,
      },
      {
        title: "Moot Court Society: Intra-College Moot Selection 2026",
        content:
          "Registration is now open for the Annual Intra-College Moot Court Competition. Teams of 3 (2 Speakers + 1 Researcher) can sign up at the Moot Court Society room.",
        category: "EVENT",
        targetRole: "STUDENT",
        authorName: "Moot Court Society MGCSIILS",
        isPinned: false,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n--- Demo Credentials (Password: Password@123) ---");
  console.log("Admin:   admin@mgcsiils.edu.in");
  console.log("Faculty: anand.kumar@mgcsiils.edu.in");
  console.log("Student: siva.govind@student.mgcsiils.edu.in");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
