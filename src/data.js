export const DEMO_STUDENT = {
  matricNumber: "YCT/23/1234",
  password: "Student@123",
  name: "Demo Student",
  department: "Computer Technology",
  programme: "National Diploma",
  level: "ND II",
  email: "student@example.test",
};

export const DEMO_ADMIN = { username: "admin", password: "Admin@123" };

export const REQUIRED_DOCUMENTS = [
  "Passport photograph",
  "Admission letter",
  "JAMB result",
  "O'Level result",
  "Birth certificate",
  "Local Government certificate",
  "School-fee receipt",
];

export const INITIAL_STUDENTS = [
  {
    matricNumber: DEMO_STUDENT.matricNumber,
    name: DEMO_STUDENT.name,
    department: DEMO_STUDENT.department,
    programme: DEMO_STUDENT.programme,
    level: DEMO_STUDENT.level,
    email: DEMO_STUDENT.email,
    phone: "",
    address: "",
    dateOfBirth: "",
    feeVerified: false,
    documents: {},
    screeningStatus: "Not Started",
    reviewerFeedback: "",
    submittedAt: "",
    approvedAt: "",
  },
];