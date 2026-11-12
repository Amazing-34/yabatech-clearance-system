import { INITIAL_STUDENTS } from "./data";

const STUDENTS_KEY = "yct_demo_students_v1";
const SESSION_KEY = "yct_demo_session_v1";

export function readStudents() {
  try {
    const value = localStorage.getItem(STUDENTS_KEY);
    return value ? JSON.parse(value) : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function writeStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function writeSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}