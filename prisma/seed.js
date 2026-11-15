const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MGCSIILS Full Institutional Hierarchy & Master Timetable...");

  // 1. Clear database
  await prisma.paymentReceipt.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.feeStructure.deleteMany({});
  await prisma.examResult.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.attendanceEntry.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.timetableSlot.deleteMany({});
  await prisma.courseAllocation.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.classroom.deleteMany({});
  await prisma.facultyProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.notice.deleteMany({});

  // 2. Departments
  const lawDept = await prisma.department.create({
    data: { name: "Faculty of Law", code: "LAW" },
  });
  const mgmtDept = await prisma.department.create({
    data: { name: "Management & Social Sciences", code: "MGMT_HUM" },
  });

  // 3. Classrooms
  const roomLH101 = await prisma.classroom.create({
    data: { name: "Lecture Hall 101", code: "LH-101", capacity: 70, type: "LECTURE_HALL" },
  });
  const roomLH102 = await prisma.classroom.create({
    data: { name: "Lecture Hall 102", code: "LH-102", capacity: 70, type: "LECTURE_HALL" },
  });
  const roomLH201 = await prisma.classroom.create({
    data: { name: "Lecture Hall 201", code: "LH-201", capacity: 70, type: "LECTURE_HALL" },
  });
  const roomMCH = await prisma.classroom.create({
    data: { name: "Moot Court Hall", code: "MCH", capacity: 120, type: "MOOT_COURT" },
  });
  const roomSEM = await prisma.classroom.create({
    data: { name: "Central Seminar Hall", code: "SEM", capacity: 250, type: "SEMINAR_HALL" },
  });

  // 4. Programs
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

  const unitaryLlb = await prisma.program.create({
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

  // 5. Courses (Semester 1 B.A. LL.B.)
  const courseEnglish = await prisma.course.create({
    data: { code: "EN 1121", name: "English Language Skills", credits: 4, semester: 1, programId: baLlb.id },
  });
  const coursePolSci = await prisma.course.create({
    data: { code: "PS 1101", name: "Principles of Political Science", credits: 4, semester: 1, programId: baLlb.id },
  });
  const courseSoc = await prisma.course.create({
    data: { code: "SO 1101", name: "Principles of Sociology", credits: 4, semester: 1, programId: baLlb.id },
  });
  const courseTorts = await prisma.course.create({
    data: { code: "LC 1101", name: "Law of Torts & Motor Vehicles Act", credits: 4, semester: 1, programId: baLlb.id },
  });
  const courseContracts = await prisma.course.create({
    data: { code: "LC 1102", name: "General Principles of Contract", credits: 4, semester: 1, programId: baLlb.id },
  });

  // Default Password
  const defaultPassword = await bcrypt.hash("Password@123", 10);

  // 6. Leadership & Faculty Roster
  // Principal
  const principalUser = await prisma.user.create({
    data: {
      name: "Dr. Lizzie Albert",
      email: "principal@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  });
  const principalProfile = await prisma.facultyProfile.create({
    data: {
      userId: principalUser.id,
      employeeCode: "EMP-001",
      roleTitle: "PRINCIPAL",
      designation: "Principal & Professor of Law",
      departmentId: lawDept.id,
      departmentName: "Law",
      qualification: "LL.M., Ph.D. in Constitutional Jurisprudence",
      phone: "+91 94471 00001",
      maxWeeklyHours: 8,
    },
  });

  // Vice Principal
  const vpUser = await prisma.user.create({
    data: {
      name: "Keerthi S. Jyothi",
      email: "vp@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  });
  const vpProfile = await prisma.facultyProfile.create({
    data: {
      userId: vpUser.id,
      employeeCode: "EMP-002",
      roleTitle: "VICE_PRINCIPAL",
      designation: "Vice Principal & Associate Professor in Law",
      departmentId: lawDept.id,
      departmentName: "Law",
      qualification: "LL.M., UGC-NET",
      phone: "+91 94471 00002",
      maxWeeklyHours: 12,
    },
  });

  // HoD Law
  const hodUser = await prisma.user.create({
    data: {
      name: "Manu S.R.",
      email: "hod.law@mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "FACULTY",
    },
  });
  const hodProfile = await prisma.facultyProfile.create({
    data: {
      userId: hodUser.id,
      employeeCode: "EMP-003",
      roleTitle: "HOD",
      designation: "Head of Department (Law) & Associate Professor",
      departmentId: lawDept.id,
      departmentName: "Law",
      qualification: "LL.M., Ph.D.",
      phone: "+91 94471 00003",
      maxWeeklyHours: 14,
    },
  });

  // Assistant Professors
  const facultyMembersData = [
    { name: "Abhijith J.S.", email: "abhijith.js@mgcsiils.edu.in", code: "EMP-101", desig: "Assistant Professor in Law" },
    { name: "Akshaya P.S.", email: "akshaya.ps@mgcsiils.edu.in", code: "EMP-102", desig: "Assistant Professor in Law" },
    { name: "Haris A.", email: "haris.a@mgcsiils.edu.in", code: "EMP-103", desig: "Assistant Professor in Law" },
    { name: "Josin Feba G.S.", email: "josin.feba@mgcsiils.edu.in", code: "EMP-104", desig: "Assistant Professor in Law" },
    { name: "Lekshma V.H.", email: "lekshma.vh@mgcsiils.edu.in", code: "EMP-105", desig: "Assistant Professor in Law" },
    { name: "Neethu L. Sekhar", email: "neethu.sekhar@mgcsiils.edu.in", code: "EMP-106", desig: "Assistant Professor in Law" },
    { name: "Ancy A.Y.", email: "ancy.ay@mgcsiils.edu.in", code: "EMP-107", desig: "Assistant Professor in Management", dept: mgmtDept.id, deptName: "Management & Social Sciences" },
    { name: "Dr. Meera Nair", email: "meera.nair@mgcsiils.edu.in", code: "EMP-108", desig: "Assistant Professor in Social Sciences", dept: mgmtDept.id, deptName: "Management & Social Sciences" },
  ];

  const facultyProfiles = {};
  for (const f of facultyMembersData) {
    const user = await prisma.user.create({
      data: {
        name: f.name,
        email: f.email,
        passwordHash: defaultPassword,
        role: "FACULTY",
      },
    });

    const prof = await prisma.facultyProfile.create({
      data: {
        userId: user.id,
        employeeCode: f.code,
        roleTitle: "ASSISTANT_PROFESSOR",
        designation: f.desig,
        departmentId: f.dept || lawDept.id,
        departmentName: f.deptName || "Law",
        qualification: "LL.M., UGC-NET",
        phone: "+91 94471 000" + f.code.replace("EMP-", ""),
        maxWeeklyHours: 16,
      },
    });

    facultyProfiles[f.name] = prof;
  }

  // 7. Academic Sections
  // Section A (Tutor: Abhijith J.S.)
  const secA = await prisma.section.create({
    data: {
      name: "A",
      semester: 1,
      batch: "2023-2028",
      programId: baLlb.id,
      classTutorId: facultyProfiles["Abhijith J.S."].id,
      defaultRoomId: roomLH101.id,
    },
  });

  // Section B (Tutor: Akshaya P.S.)
  const secB = await prisma.section.create({
    data: {
      name: "B",
      semester: 1,
      batch: "2023-2028",
      programId: baLlb.id,
      classTutorId: facultyProfiles["Akshaya P.S."].id,
      defaultRoomId: roomLH102.id,
    },
  });

  // 3-Year LL.B. Section A (Tutor: Haris A.)
  const secLlb = await prisma.section.create({
    data: {
      name: "A",
      semester: 1,
      batch: "2024-2027",
      programId: unitaryLlb.id,
      classTutorId: facultyProfiles["Haris A."].id,
      defaultRoomId: roomLH201.id,
    },
  });

  // 8. Course Allocations
  await prisma.courseAllocation.createMany({
    data: [
      { courseId: courseTorts.id, facultyId: facultyProfiles["Abhijith J.S."].id, academicYear: "2026-2027" },
      { courseId: courseContracts.id, facultyId: hodProfile.id, academicYear: "2026-2027" },
      { courseId: courseEnglish.id, facultyId: facultyProfiles["Josin Feba G.S."].id, academicYear: "2026-2027" },
      { courseId: coursePolSci.id, facultyId: facultyProfiles["Dr. Meera Nair"].id, academicYear: "2026-2027" },
      { courseId: courseSoc.id, facultyId: facultyProfiles["Lekshma V.H."].id, academicYear: "2026-2027" },
    ],
  });

  // 9. Clash-Free Weekly Master Timetable for Section A (Monday - Friday, Periods 1 - 5)
  // Daily Schedule times:
  const periods = [
    { period: 1, start: "09:30", end: "10:30" },
    { period: 2, start: "10:30", end: "11:30" },
    { period: 3, start: "11:45", end: "12:45" },
    { period: 4, start: "01:45", end: "02:45" },
    { period: 5, start: "02:45", end: "03:45" },
  ];

  // Routine grid for Section A
  // Monday: Torts (Abhijith), Contracts (HoD Manu), English (Josin), PolSci (Meera), Sociology (Lekshma)
  const timetablePlan = [
    // Mon (day 1)
    { day: 1, period: 1, course: courseTorts, faculty: facultyProfiles["Abhijith J.S."], room: roomLH101 },
    { day: 1, period: 2, course: courseContracts, faculty: hodProfile, room: roomLH101 },
    { day: 1, period: 3, course: courseEnglish, faculty: facultyProfiles["Josin Feba G.S."], room: roomLH101 },
    { day: 1, period: 4, course: coursePolSci, faculty: facultyProfiles["Dr. Meera Nair"], room: roomLH101 },
    { day: 1, period: 5, course: courseSoc, faculty: facultyProfiles["Lekshma V.H."], room: roomLH101 },

    // Tue (day 2)
    { day: 2, period: 1, course: courseContracts, faculty: hodProfile, room: roomLH101 },
    { day: 2, period: 2, course: courseTorts, faculty: facultyProfiles["Abhijith J.S."], room: roomLH101 },
    { day: 2, period: 3, course: courseSoc, faculty: facultyProfiles["Lekshma V.H."], room: roomLH101 },
    { day: 2, period: 4, course: courseEnglish, faculty: facultyProfiles["Josin Feba G.S."], room: roomLH101 },
    { day: 2, period: 5, course: coursePolSci, faculty: facultyProfiles["Dr. Meera Nair"], room: roomLH101 },

    // Wed (day 3)
    { day: 3, period: 1, course: coursePolSci, faculty: facultyProfiles["Dr. Meera Nair"], room: roomLH101 },
    { day: 3, period: 2, course: courseEnglish, faculty: facultyProfiles["Josin Feba G.S."], room: roomLH101 },
    { day: 3, period: 3, course: courseContracts, faculty: hodProfile, room: roomLH101 },
    { day: 3, period: 4, course: courseTorts, faculty: facultyProfiles["Abhijith J.S."], room: roomMCH }, // In Moot Court Hall!
    { day: 3, period: 5, course: courseSoc, faculty: facultyProfiles["Lekshma V.H."], room: roomLH101 },

    // Thu (day 4)
    { day: 4, period: 1, course: courseSoc, faculty: facultyProfiles["Lekshma V.H."], room: roomLH101 },
    { day: 4, period: 2, course: courseTorts, faculty: facultyProfiles["Abhijith J.S."], room: roomLH101 },
    { day: 4, period: 3, course: courseContracts, faculty: hodProfile, room: roomLH101 },
    { day: 4, period: 4, course: coursePolSci, faculty: facultyProfiles["Dr. Meera Nair"], room: roomLH101 },
    { day: 4, period: 5, course: courseEnglish, faculty: facultyProfiles["Josin Feba G.S."], room: roomLH101 },

    // Fri (day 5)
    { day: 5, period: 1, course: courseEnglish, faculty: facultyProfiles["Josin Feba G.S."], room: roomLH101 },
    { day: 5, period: 2, course: coursePolSci, faculty: facultyProfiles["Dr. Meera Nair"], room: roomLH101 },
    { day: 5, period: 3, course: courseTorts, faculty: facultyProfiles["Abhijith J.S."], room: roomLH101 },
    { day: 5, period: 4, course: courseContracts, faculty: hodProfile, room: roomLH101 },
    { day: 5, period: 5, course: courseSoc, faculty: facultyProfiles["Lekshma V.H."], room: roomLH101 },
  ];

  for (const item of timetablePlan) {
    const pMeta = periods.find((p) => p.period === item.period);
    await prisma.timetableSlot.create({
      data: {
        dayOfWeek: item.day,
        period: item.period,
        startTime: pMeta.start,
        endTime: pMeta.end,
        sectionId: secA.id,
        courseId: item.course.id,
        facultyId: item.faculty.id,
        classroomId: item.room.id,
        academicYear: "2026-2027",
      },
    });
  }

  // 10. Students
  const sivaUser = await prisma.user.create({
    data: {
      name: "SIVA GOVIND V",
      email: "siva.govind@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "STUDENT",
    },
  });

  const siva = await prisma.studentProfile.create({
    data: {
      userId: sivaUser.id,
      candidateCode: "47320105",
      registrationNo: "KER-2023-BALLB-042",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      sectionName: "A",
      sectionId: secA.id,
      gender: "Male",
      dob: new Date("2005-04-12"),
      phone: "+91 98470 11223",
      address: "Parassala P.O., Thiruvananthapuram, Kerala - 695502",
      guardianName: "Vijayakumar P",
      guardianPhone: "+91 94470 99887",
      status: "ACTIVE",
    },
  });

  const ananyaUser = await prisma.user.create({
    data: {
      name: "ANANYA KRISHNA",
      email: "ananya.krishna@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "STUDENT",
    },
  });

  const ananya = await prisma.studentProfile.create({
    data: {
      userId: ananyaUser.id,
      candidateCode: "47320106",
      registrationNo: "KER-2023-BALLB-043",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      sectionName: "A",
      sectionId: secA.id,
      gender: "Female",
      dob: new Date("2005-08-20"),
      phone: "+91 98471 22334",
      address: "Neyyattinkara, Kerala - 695121",
      guardianName: "Krishnakumar S",
      guardianPhone: "+91 94473 88776",
      status: "ACTIVE",
    },
  });

  const rahulUser = await prisma.user.create({
    data: {
      name: "RAHUL MATHEW",
      email: "rahul.mathew@student.mgcsiils.edu.in",
      passwordHash: defaultPassword,
      role: "STUDENT",
    },
  });

  const rahul = await prisma.studentProfile.create({
    data: {
      userId: rahulUser.id,
      candidateCode: "47320107",
      registrationNo: "KER-2023-BALLB-044",
      programId: baLlb.id,
      batch: "2023-2028",
      semester: 1,
      sectionName: "A",
      sectionId: secA.id,
      gender: "Male",
      dob: new Date("2004-11-15"),
      phone: "+91 98472 33445",
      address: "Cheruvarakonam, Kerala - 695502",
      guardianName: "Mathew George",
      guardianPhone: "+91 94475 77665",
      status: "ACTIVE",
    },
  });

  // 11. Attendance Records (10 sessions)
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const rec = await prisma.attendanceRecord.create({
      data: {
        programId: baLlb.id,
        semester: 1,
        sectionId: secA.id,
        section: "A",
        date: d,
        period: 1,
        recordedBy: "Prof. Abhijith J.S. (Class Tutor)",
      },
    });

    await prisma.attendanceEntry.createMany({
      data: [
        { attendanceRecordId: rec.id, studentId: siva.id, status: i === 5 ? "ABSENT" : "PRESENT" },
        { attendanceRecordId: rec.id, studentId: ananya.id, status: i === 3 || i === 7 ? "ABSENT" : "PRESENT" },
        { attendanceRecordId: rec.id, studentId: rahul.id, status: [1, 3, 6, 8].includes(i) ? "ABSENT" : "PRESENT" },
      ],
    });
  }

  // 12. Exam & Results
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

  const courses = [courseEnglish, coursePolSci, courseSoc, courseTorts, courseContracts];
  const marksData = [
    { student: siva, ca: 23, esa: 65, total: 88, gp: 8.5, grade: "A" },
    { student: ananya, ca: 21, esa: 58, total: 79, gp: 7.5, grade: "B+" },
    { student: rahul, ca: 18, esa: 48, total: 66, gp: 6.5, grade: "B" },
  ];

  for (const m of marksData) {
    for (const c of courses) {
      await prisma.examResult.create({
        data: {
          examId: exam.id,
          studentId: m.student.id,
          courseId: c.id,
          caMark: m.ca,
          esaMark: m.esa,
          totalMark: m.total,
          gradePoint: m.gp,
          grade: m.grade,
          status: "PASSED",
        },
      });
    }
  }

  // 13. Fee Structure & Invoices
  const feeStructure = await prisma.feeStructure.create({
    data: {
      programId: baLlb.id,
      semester: 1,
      title: "Semester 1 Tuition & Amenities Fee",
      tuitionFee: 32000,
      specialFee: 5000,
      libraryFee: 3500,
      examFee: 2000,
      totalAmount: 42500,
    },
  });

  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00101",
      studentId: siva.id,
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

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00102",
      studentId: ananya.id,
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

  await prisma.invoice.create({
    data: {
      invoiceNo: "INV-2026-00103",
      studentId: rahul.id,
      feeStructureId: feeStructure.id,
      totalAmount: 42500,
      paidAmount: 0,
      status: "PENDING",
      dueDate: new Date("2026-12-15"),
    },
  });

  // 14. Notices
  await prisma.notice.createMany({
    data: [
      {
        title: "Campus Emergency Medical Assistance Room Operational",
        content:
          "In full compliance with safety standards, a dedicated First-Aid & Emergency Response Room with vehicle transport assistance is now operational at the Administrative Block.",
        category: "GENERAL",
        targetRole: "ALL",
        authorName: "Office of the Principal (Dr. Lizzie Albert)",
        isPinned: true,
      },
      {
        title: "Department of Law: Continuous Assessment Submission Deadline",
        content:
          "All Law Faculty members are requested to complete CA mark entries for Semester 1 subjects before 4:00 PM this Friday for moderation.",
        category: "ACADEMIC",
        targetRole: "FACULTY",
        authorName: "Manu S.R. (HoD Law)",
        isPinned: true,
      },
      {
        title: "Master Timetable Released for Academic Year 2026-2027",
        content:
          "The timetable for B.A. LL.B., B.Com. LL.B., BBA LL.B., and 3-Year LL.B. is finalized. Classes commence daily at 09:30 AM in respective assigned lecture halls.",
        category: "ACADEMIC",
        targetRole: "ALL",
        authorName: "Keerthi S. Jyothi (Vice Principal)",
        isPinned: false,
      },
    ],
  });

  console.log("✅ Seed completed successfully with full leadership roster!");
  console.log("\n--- Demo Accounts (Password: Password@123) ---");
  console.log("Principal:      principal@mgcsiils.edu.in (Dr. Lizzie Albert)");
  console.log("Vice Principal: vp@mgcsiils.edu.in (Keerthi S. Jyothi)");
  console.log("HoD Law:        hod.law@mgcsiils.edu.in (Manu S.R.)");
  console.log("Class Tutor:    abhijith.js@mgcsiils.edu.in (Abhijith J.S.)");
  console.log("Student:        siva.govind@student.mgcsiils.edu.in (Siva Govind V)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
