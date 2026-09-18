var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");

// src/lib/data/initialData.ts
var INITIAL_USERS = [
  {
    id: "usr-001",
    username: "superadmin",
    email: "admin@kroudigital.edu.kh",
    nameKhmer: "\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u1794\u178E\u17D2\u178C\u17B7\u178F \u1787\u17B6 \u179F\u17BB\u179C\u178E\u17D2\u178E",
    nameEnglish: "Dr. Chea Sovann",
    role: "SUPER_ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+855 12 888 999"
  },
  {
    id: "usr-002",
    username: "schooladmin",
    email: "director@kroudigital.edu.kh",
    nameKhmer: "\u179B\u17C4\u1780 \u1782\u17B9\u1798 \u179F\u17BB\u1795\u179B",
    nameEnglish: "Kim Sophal",
    role: "ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+855 17 777 666"
  },
  {
    id: "usr-003",
    username: "teacher.sokha",
    email: "sokha.chan@kroudigital.edu.kh",
    nameKhmer: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    nameEnglish: "Chan Sokha",
    role: "TEACHER",
    teacherId: "tch-001",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+855 70 334 455"
  },
  {
    id: "usr-004",
    username: "student.dara",
    email: "dara.sok@student.kroudigital.edu.kh",
    nameKhmer: "\u179F\u17BB\u1781 \u1785\u17B6\u1793\u17CB\u178A\u17B6\u179A\u17C9\u17B6",
    nameEnglish: "Sok Chandara",
    role: "STUDENT",
    studentId: "std-001",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    phone: "+855 98 112 233"
  },
  {
    id: "usr-005",
    username: "parent.channy",
    email: "channy.parent@gmail.com",
    nameKhmer: "\u17A2\u17D2\u1793\u1780\u179F\u17D2\u179A\u17B8 \u1780\u17C2\u179C \u1785\u17B6\u1793\u17CB\u1793\u17B8",
    nameEnglish: "Keo Channy",
    role: "PARENT",
    parentId: "par-001",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+855 12 334 455"
  }
];
var INITIAL_CLASSES = [
  {
    id: "cls-12a",
    name: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780 (\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u1796\u17B7\u178F)",
    grade: 12,
    academicYear: "\u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6",
    room: "\u1794\u1793\u17D2\u1791\u1794\u17CB A101 (\u17A2\u1782\u17B6\u179A\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A)",
    teacherId: "tch-001",
    teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    studentCount: 0,
    capacity: 35,
    shift: "MORNING"
  },
  {
    id: "cls-11b",
    name: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E1 \u1781 (\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u179F\u1784\u17D2\u1782\u1798)",
    grade: 11,
    academicYear: "\u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6",
    room: "\u1794\u1793\u17D2\u1791\u1794\u17CB B202 (\u17A2\u1782\u17B6\u179A\u1796\u17A0\u17BB\u1794\u17C6\u178E\u1784)",
    teacherId: "tch-002",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6",
    studentCount: 0,
    capacity: 35,
    shift: "MORNING"
  },
  {
    id: "cls-10c",
    name: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E0 \u1782 (\u1785\u17C6\u178E\u17C1\u17C7\u1791\u17BC\u1791\u17C5)",
    grade: 10,
    academicYear: "\u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6",
    room: "\u1794\u1793\u17D2\u1791\u1794\u17CB C301 (\u17A2\u1782\u17B6\u179A\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1790\u17D2\u1798\u17B8)",
    teacherId: "tch-003",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B",
    studentCount: 0,
    capacity: 40,
    shift: "AFTERNOON"
  }
];
var INITIAL_TEACHERS = [
  {
    id: "tch-001",
    teacherCode: "TCH-001",
    nameKhmer: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    nameEnglish: "Chan Sokha",
    gender: "FEMALE",
    email: "sokha.chan@kroudigital.edu.kh",
    phone: "012 345 678",
    department: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A \u1793\u17B7\u1784\u17A2\u1780\u17D2\u179F\u179A\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A",
    subjects: ["\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A", "\u17A2\u1780\u17D2\u179F\u179A\u179F\u17B7\u179B\u17D2\u1794\u17CD\u1791\u179F\u17D2\u179F\u1793\u17C8"],
    degree: "\u1794\u179A\u17B7\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A\u1787\u17B6\u1793\u17CB\u1781\u17D2\u1796\u179F\u17CB \u17A2\u1780\u17D2\u179F\u179A\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u1781\u17D2\u1798\u17C2\u179A (RUPP)",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2019-09-01",
    assignedClassNames: ["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E1 \u1781"]
  },
  {
    id: "tch-002",
    teacherCode: "TCH-002",
    nameKhmer: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6",
    nameEnglish: "Heng Vanna",
    gender: "MALE",
    email: "vanna.heng@kroudigital.edu.kh",
    phone: "098 765 432",
    department: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1793\u17B7\u1784\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    subjects: ["\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6", "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6"],
    degree: "\u1794\u179A\u17B7\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A\u1787\u17B6\u1793\u17CB\u1781\u17D2\u1796\u179F\u17CB \u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6\u17A2\u1793\u17BB\u179C\u178F\u17D2\u178F (ITC)",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2020-10-15",
    assignedClassNames: ["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E0 \u1782"]
  },
  {
    id: "tch-003",
    teacherCode: "TCH-003",
    nameKhmer: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B",
    nameEnglish: "Sin Piseth",
    gender: "MALE",
    email: "piseth.sin@kroudigital.edu.kh",
    phone: "010 445 566",
    department: "\u1794\u1785\u17D2\u1785\u17C1\u1780\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1793\u17B7\u1784\u1797\u17B6\u179F\u17B6\u1794\u179A\u1791\u17C1\u179F",
    subjects: ["\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179C\u17B7\u1791\u17D2\u1799\u17B6", "\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F"],
    degree: "\u1794\u179A\u17B7\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A \u179C\u17B7\u179F\u17D2\u179C\u1780\u1798\u17D2\u1798\u1780\u17BB\u17C6\u1796\u17D2\u1799\u17BC\u1791\u17D0\u179A \u1793\u17B7\u1784 TESOL",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2022-01-10",
    assignedClassNames: ["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E1 \u1781", "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E0 \u1782"]
  }
];
var INITIAL_SUBJECTS = [
  {
    id: "sbj-01",
    code: "KHM101",
    nameKhmer: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A \u1793\u17B7\u1784\u17A2\u1780\u17D2\u179F\u179A\u179F\u17B7\u179B\u17D2\u1794\u17CD",
    nameEnglish: "Khmer Literature",
    credits: 4,
    hoursPerWeek: 5,
    department: "\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u179F\u1784\u17D2\u1782\u1798",
    teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    applicableGrades: [10, 11, 12]
  },
  {
    id: "sbj-02",
    code: "MAT101",
    nameKhmer: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6 (\u1796\u17B8\u1787\u1782\u178E\u17B7\u178F & \u1792\u179A\u178E\u17B8\u1798\u17B6\u178F\u17D2\u179A)",
    nameEnglish: "Mathematics",
    credits: 5,
    hoursPerWeek: 6,
    department: "\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u1796\u17B7\u178F",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6",
    applicableGrades: [10, 11, 12]
  },
  {
    id: "sbj-03",
    code: "PHY101",
    nameKhmer: "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6\u1796\u17B7\u179F\u17C4\u1792\u1793\u17CD",
    nameEnglish: "Applied Physics",
    credits: 3,
    hoursPerWeek: 4,
    department: "\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A\u1796\u17B7\u178F",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6",
    applicableGrades: [11, 12]
  },
  {
    id: "sbj-04",
    code: "ENG101",
    nameKhmer: "\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F\u1791\u17BC\u1791\u17C5 (Oxford Pathway)",
    nameEnglish: "English Language",
    credits: 3,
    hoursPerWeek: 4,
    department: "\u1797\u17B6\u179F\u17B6\u1794\u179A\u1791\u17C1\u179F",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B",
    applicableGrades: [10, 11, 12]
  },
  {
    id: "sbj-05",
    code: "INF101",
    nameKhmer: "\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1793\u17B7\u1784\u178C\u17B8\u1787\u17B8\u1790\u179B (ICT)",
    nameEnglish: "Computer Science & ICT",
    credits: 3,
    hoursPerWeek: 3,
    department: "\u1794\u1785\u17D2\u1785\u17C1\u1780\u179C\u17B7\u1791\u17D2\u1799\u17B6\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793",
    teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B",
    applicableGrades: [10, 11, 12]
  }
];
var INITIAL_STUDENTS = [];
var INITIAL_ATTENDANCE = [];
var INITIAL_GRADES = [];
var INITIAL_SCHEDULE = [
  // Monday (dayOfWeek = 1)
  { id: "sch-01", dayOfWeek: 1, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-01", subjectName: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A", teacherId: "tch-001", teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6", room: "A101", color: "bg-cyan-50 border-cyan-300 text-cyan-800" },
  { id: "sch-02", dayOfWeek: 1, period: 2, startTime: "08:30", endTime: "09:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-02", subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-blue-50 border-blue-300 text-blue-800" },
  { id: "sch-03", dayOfWeek: 1, period: 3, startTime: "09:40", endTime: "10:30", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-03", subjectName: "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "Lab 1", color: "bg-teal-50 border-teal-300 text-teal-800" },
  { id: "sch-04", dayOfWeek: 1, period: 4, startTime: "10:40", endTime: "11:30", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-04", subjectName: "\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F", teacherId: "tch-003", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B", room: "A101", color: "bg-indigo-50 border-indigo-300 text-indigo-800" },
  // Tuesday (dayOfWeek = 2)
  { id: "sch-05", dayOfWeek: 2, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-02", subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-blue-50 border-blue-300 text-blue-800" },
  { id: "sch-06", dayOfWeek: 2, period: 2, startTime: "08:30", endTime: "09:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-05", subjectName: "\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179C\u17B7\u1791\u17D2\u1799\u17B6 (ICT)", teacherId: "tch-003", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B", room: "Computer Lab 2", color: "bg-purple-50 border-purple-300 text-purple-800" },
  { id: "sch-07", dayOfWeek: 2, period: 3, startTime: "09:40", endTime: "10:30", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-01", subjectName: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A", teacherId: "tch-001", teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6", room: "A101", color: "bg-cyan-50 border-cyan-300 text-cyan-800" },
  // Wednesday (dayOfWeek = 3)
  { id: "sch-08", dayOfWeek: 3, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-03", subjectName: "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-teal-50 border-teal-300 text-teal-800" },
  { id: "sch-09", dayOfWeek: 3, period: 2, startTime: "08:30", endTime: "09:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-04", subjectName: "\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F", teacherId: "tch-003", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B", room: "A101", color: "bg-indigo-50 border-indigo-300 text-indigo-800" },
  { id: "sch-10", dayOfWeek: 3, period: 3, startTime: "09:40", endTime: "10:30", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-02", subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-blue-50 border-blue-300 text-blue-800" },
  // Thursday (dayOfWeek = 4)
  { id: "sch-11", dayOfWeek: 4, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-05", subjectName: "\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179C\u17B7\u1791\u17D2\u1799\u17B6 (ICT)", teacherId: "tch-003", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B", room: "Computer Lab 2", color: "bg-purple-50 border-purple-300 text-purple-800" },
  { id: "sch-12", dayOfWeek: 4, period: 2, startTime: "08:30", endTime: "09:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-01", subjectName: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A", teacherId: "tch-001", teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6", room: "A101", color: "bg-cyan-50 border-cyan-300 text-cyan-800" },
  { id: "sch-13", dayOfWeek: 4, period: 3, startTime: "09:40", endTime: "10:30", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-02", subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-blue-50 border-blue-300 text-blue-800" },
  // Friday (dayOfWeek = 5)
  { id: "sch-14", dayOfWeek: 5, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-04", subjectName: "\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F", teacherId: "tch-003", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u179F\u17CA\u17B7\u1793 \u1796\u17B7\u179F\u17B7\u178A\u17D2\u178B", room: "A101", color: "bg-indigo-50 border-indigo-300 text-indigo-800" },
  { id: "sch-15", dayOfWeek: 5, period: 2, startTime: "08:30", endTime: "09:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-03", subjectName: "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-teal-50 border-teal-300 text-teal-800" },
  // Saturday (dayOfWeek = 6)
  { id: "sch-16", dayOfWeek: 6, period: 1, startTime: "07:30", endTime: "08:20", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-01", subjectName: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A (\u178F\u17C2\u1784\u179F\u17C1\u1785\u1780\u17D2\u178F\u17B8)", teacherId: "tch-001", teacherName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6", room: "A101", color: "bg-cyan-50 border-cyan-300 text-cyan-800" },
  { id: "sch-17", dayOfWeek: 6, period: 2, startTime: "08:30", endTime: "10:00", classId: "cls-12a", className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780", subjectId: "sbj-02", subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6 (\u179C\u17B7\u1789\u17D2\u1789\u17B6\u179F\u17B6\u178F\u17D2\u179A\u17C0\u1798\u1794\u17B6\u1780\u17CB\u178C\u17BB\u1794)", teacherId: "tch-002", teacherName: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6", room: "A101", color: "bg-blue-50 border-blue-300 text-blue-800" }
];
var INITIAL_EXAMS = [
  {
    id: "exm-01",
    titleKhmer: "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784\u1786\u1798\u17B6\u179F\u1791\u17B8\u17E1 \u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    titleEnglish: "Semester 1 Final Exam - Mathematics",
    examType: "FINAL",
    subjectId: "sbj-02",
    subjectName: "\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    classId: "cls-12a",
    className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
    date: "2026-09-28",
    startTime: "08:00",
    endTime: "10:30",
    durationMinutes: 150,
    room: "\u179F\u17B6\u179B\u1794\u17D2\u179A\u17A1\u1784\u1792\u17C6 (\u17A2\u1782\u17B6\u179A A)",
    totalMarks: 100,
    passMarks: 50,
    status: "SCHEDULED"
  },
  {
    id: "exm-02",
    titleKhmer: "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784\u179C\u17B6\u179F\u17CB\u179F\u17D2\u1791\u1784\u17CB\u179F\u1798\u178F\u17D2\u1790\u1797\u17B6\u1796\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1781\u17C2\u1780\u1789\u17D2\u1789\u17B6 - \u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
    titleEnglish: "September Monthly Assessment - Khmer Literature",
    examType: "MONTHLY",
    subjectId: "sbj-01",
    subjectName: "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
    classId: "cls-12a",
    className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
    date: "2026-09-22",
    startTime: "08:00",
    endTime: "09:30",
    durationMinutes: 90,
    room: "A101",
    totalMarks: 50,
    passMarks: 25,
    status: "SCHEDULED"
  },
  {
    id: "exm-03",
    titleKhmer: "\u178F\u17C1\u179F\u17D2\u178F\u178F\u17D2\u179A\u17C0\u1798\u1794\u17D2\u179A\u17A1\u1784\u179F\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A\u1798\u1792\u17D2\u1799\u1798\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1791\u17BB\u178F\u17B7\u1799\u1797\u17BC\u1798\u17B7 (\u1794\u17B6\u1780\u17CB\u178C\u17BB\u1794) - \u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    titleEnglish: "National Exam Mock Test - Physics",
    examType: "NATIONAL_PREP",
    subjectId: "sbj-03",
    subjectName: "\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    classId: "cls-12a",
    className: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
    date: "2026-10-05",
    startTime: "14:00",
    endTime: "16:00",
    durationMinutes: 120,
    room: "A101",
    totalMarks: 75,
    passMarks: 38,
    status: "SCHEDULED"
  }
];
var INITIAL_DOCUMENTS = [
  {
    id: "doc-01",
    title: "\u179F\u17C0\u179C\u1797\u17C5\u1782\u17C4\u179B \u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1787\u17B6\u178F\u17B7\u1780\u1798\u17D2\u179A\u17B7\u178F\u1798\u1792\u17D2\u1799\u1798\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1791\u17BB\u178F\u17B7\u1799\u1797\u17BC\u1798\u17B7 \u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6",
    category: "CURRICULUM",
    fileType: "PDF",
    fileSize: "4.8 MB",
    uploadedBy: "\u1780\u17D2\u179A\u179F\u17BD\u1784\u17A2\u1794\u17CB\u179A\u17C6 \u1799\u17BB\u179C\u1787\u1793 \u1793\u17B7\u1784\u1780\u17B8\u17A1\u17B6",
    uploadedAt: "2025-08-20",
    downloadCount: 342,
    isStoredInDrive: true,
    driveWebViewLink: "https://drive.google.com/file/d/demo-curriculum-2025/view",
    driveFolderName: "KrouDigital 4.0 - \u1794\u178E\u17D2\u178E\u17B6\u179B\u17D0\u1799\u179F\u17B6\u179B\u17B6"
  },
  {
    id: "doc-02",
    title: "\u1794\u1791\u1794\u1789\u17D2\u1787\u17B6\u1795\u17D2\u1791\u17C3\u1780\u17D2\u1793\u17BB\u1784\u179F\u17B6\u179B\u17B6\u179A\u17C0\u1793 \u1793\u17B7\u1784\u1780\u17D2\u179A\u1798\u179F\u17B8\u179B\u1792\u1798\u17CC\u179F\u17B7\u179F\u17D2\u179F\u17B6\u1793\u17BB\u179F\u17B7\u179F\u17D2\u179F KrouDigital4.0",
    category: "POLICY",
    fileType: "PDF",
    fileSize: "1.2 MB",
    uploadedBy: "\u1782\u178E\u17C8\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6",
    uploadedAt: "2025-09-01",
    downloadCount: 189
  },
  {
    id: "doc-03",
    title: "\u179C\u17B7\u1789\u17D2\u1789\u17B6\u179F\u17B6\u1782\u17C6\u179A\u17BC \u178F\u17D2\u179A\u17C0\u1798\u1794\u17D2\u179A\u17A1\u1784\u179F\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A\u1794\u17B6\u1780\u17CB\u178C\u17BB\u1794 \u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1793\u17B7\u1784\u1782\u1793\u17D2\u179B\u17B9\u17C7\u178A\u17C4\u17C7\u179F\u17D2\u179A\u17B6\u1799",
    category: "WORKSHEET",
    fileType: "PDF",
    fileSize: "3.1 MB",
    uploadedBy: "\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A0\u17C1\u1784 \u179C\u178E\u17D2\u178E\u17B6",
    uploadedAt: "2025-09-10",
    downloadCount: 520
  },
  {
    id: "doc-04",
    title: "\u1782\u17C6\u179A\u17BC\u1780\u17B7\u1785\u17D2\u1785\u178F\u17C2\u1784\u1780\u17B6\u179A\u1794\u1784\u17D2\u179A\u17C0\u1793\u178F\u17B6\u1798\u1794\u17C2\u1794\u179F\u17D2\u1790\u17B6\u1794\u1793\u17B6 \u1793\u17B7\u1784\u1794\u1785\u17D2\u1785\u17C1\u1780\u179C\u17B7\u1791\u17D2\u1799\u17B6\u178C\u17B8\u1787\u17B8\u1790\u179B (ICT Integrated)",
    category: "ADMINISTRATIVE",
    fileType: "DOCX",
    fileSize: "890 KB",
    uploadedBy: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    uploadedAt: "2025-09-05",
    downloadCount: 114
  },
  {
    id: "doc-05",
    title: "\u1782\u17C4\u179B\u1780\u17B6\u179A\u178E\u17CD\u178E\u17C2\u1793\u17B6\u17C6\u179F\u17D2\u178F\u17B8\u1796\u17B8\u1780\u17B6\u179A\u179C\u17B6\u1799\u178F\u1798\u17D2\u179B\u17C3\u179B\u1791\u17D2\u1792\u1795\u179B\u179F\u17B7\u1780\u17D2\u179F\u17B6 \u1793\u17B7\u1784\u1780\u17B6\u179A\u1782\u178E\u1793\u17B6\u1796\u17B7\u1793\u17D2\u1791\u17BB\u1798\u1792\u17D2\u1799\u1798\u1797\u17B6\u1782",
    category: "POLICY",
    fileType: "PDF",
    fileSize: "1.8 MB",
    uploadedBy: "\u1780\u17B6\u179A\u17B7\u1799\u17B6\u179B\u17D0\u1799\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1792\u17B7\u1780\u17B6\u179A",
    uploadedAt: "2025-09-02",
    downloadCount: 230
  },
  {
    id: "doc-06",
    title: "\u179F\u1793\u17D2\u179B\u17B9\u1780\u1780\u17B7\u1785\u17D2\u1785\u1780\u17B6\u179A\u179B\u17C6\u17A0\u17B6\u178F\u17CB\u1794\u17D2\u179A\u1785\u17B6\u17C6\u179F\u1794\u17D2\u178F\u17B6\u17A0\u17CD \u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u179A\u17BC\u1794\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1793\u17B7\u1784\u1782\u17B8\u1798\u17B8\u179C\u17B7\u1791\u17D2\u1799\u17B6 \u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2",
    category: "WORKSHEET",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedBy: "\u1782\u178E\u17C8\u1780\u1798\u17D2\u1798\u1780\u17B6\u179A\u1794\u1785\u17D2\u1785\u17C1\u1780\u1791\u17C1\u179F\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A",
    uploadedAt: "2025-09-12",
    downloadCount: 410
  },
  {
    id: "doc-07",
    title: "\u1791\u1798\u17D2\u179A\u1784\u17CB\u1794\u17C2\u1794\u1794\u1791\u179F\u17D2\u1793\u17BE\u179F\u17BB\u17C6\u1785\u17D2\u1794\u17B6\u1794\u17CB\u1788\u1794\u17CB\u179F\u1798\u17D2\u179A\u17B6\u1780 \u1793\u17B7\u1784\u179B\u17B7\u1781\u17B7\u178F\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u179F\u17B7\u1780\u17D2\u179F\u17B6\u179A\u1794\u179F\u17CB\u179F\u17B7\u179F\u17D2\u179F",
    category: "ADMINISTRATIVE",
    fileType: "DOCX",
    fileSize: "650 KB",
    uploadedBy: "\u179B\u17C1\u1781\u17B6\u1792\u17B7\u1780\u17B6\u179A\u178A\u17D2\u178B\u17B6\u1793\u179F\u17B6\u179B\u17B6",
    uploadedAt: "2025-09-08",
    downloadCount: 175
  },
  {
    id: "doc-08",
    title: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1798\u17D2\u179A\u17BB\u1784\u1791\u17BB\u1780\u1794\u1789\u17D2\u1787\u17B8\u179F\u17B7\u179F\u17D2\u179F (\u17E1\u17E6 \u179C\u17B6\u179B) \u1780\u17D2\u1793\u17BB\u1784 Google Drive - KrouDigital4.0",
    category: "ADMINISTRATIVE",
    fileType: "EXCEL",
    fileSize: "2.1 MB",
    uploadedBy: "\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7 (Google Drive Cloud)",
    uploadedAt: "2025-09-15",
    downloadCount: 88,
    isStoredInDrive: true,
    driveWebViewLink: "https://drive.google.com/file/d/demo-backup-students/view",
    driveFolderName: "KrouDigital 4.0 - \u1794\u178E\u17D2\u178E\u17B6\u179B\u17D0\u1799\u179F\u17B6\u179B\u17B6"
  }
];
var INITIAL_NOTIFICATIONS = [
  {
    id: "notif-01",
    title: "\u179F\u17D2\u179C\u17B6\u1782\u1798\u1793\u17CD\u1798\u1780\u1780\u17B6\u1793\u17CB\u1786\u17D2\u1793\u17B6\u17C6\u179F\u17B7\u1780\u17D2\u179F\u17B6\u1790\u17D2\u1798\u17B8 \u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6!",
    message: "\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6\u179A\u17C0\u1793 KrouDigital4.0 \u1794\u17B6\u1793\u178A\u17B6\u1780\u17CB\u17B1\u17D2\u1799\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u1787\u17B6\u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1782\u17B6\u17C6\u1791\u17D2\u179A\u1780\u17B6\u179A\u179F\u17B7\u1780\u17D2\u179F\u17B6 \u1780\u17B6\u179A\u178F\u17B6\u1798\u178A\u17B6\u1793\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793 \u1793\u17B7\u1784\u1780\u17B6\u179A\u179C\u17B6\u1799\u178F\u1798\u17D2\u179B\u17C3\u1796\u17B7\u1793\u17D2\u1791\u17BB\u178A\u17C4\u1799\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u17D4",
    type: "ANNOUNCEMENT",
    createdAt: "2026-09-16 08:00",
    read: false,
    priority: "HIGH"
  },
  {
    id: "notif-02",
    title: "\u1780\u17B6\u179A\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784\u17A2\u17C6\u1796\u17B8\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782\u1794\u17D2\u179A\u17A1\u1784\u1796\u17B6\u1780\u17CB\u1780\u178E\u17D2\u178F\u17B6\u179B\u1786\u1798\u17B6\u179F",
    message: '\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782\u1794\u17D2\u179A\u17A1\u1784\u1796\u17B6\u1780\u17CB\u1780\u178E\u17D2\u178F\u17B6\u179B\u1786\u1798\u17B6\u179F\u1791\u17B8\u17E1 \u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1795\u17D2\u179F\u1796\u17D2\u179C\u1795\u17D2\u179F\u17B6\u1799\u17D4 \u179F\u17BC\u1798\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1793\u17B7\u1784\u179F\u17B7\u179F\u17D2\u179F\u17B6\u1793\u17BB\u179F\u17B7\u179F\u17D2\u179F\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u1798\u17BE\u179B\u1780\u17D2\u1793\u17BB\u1784\u1795\u17D2\u1793\u17C2\u1780 "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784"\u17D4',
    type: "EXAM",
    createdAt: "2026-09-15 14:30",
    read: false,
    priority: "NORMAL"
  },
  {
    id: "notif-03",
    title: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1790\u17D2\u1784\u17C3\u1794\u17B6\u1793\u1792\u17D2\u179C\u17BE\u1794\u1785\u17D2\u1785\u17BB\u1794\u17D2\u1794\u1793\u17D2\u1793\u1797\u17B6\u1796",
    message: "\u17A2\u178F\u17D2\u179A\u17B6\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u179F\u179A\u17BB\u1794\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1790\u17D2\u1784\u17C3\u179A\u1794\u179F\u17CB\u179F\u17B6\u179B\u17B6\u179F\u1798\u17D2\u179A\u17C1\u1785\u1794\u17B6\u1793 \u17E9\u17E6.\u17E8%\u17D4 \u17A2\u179A\u1782\u17BB\u178E\u179B\u17C4\u1780\u1782\u17D2\u179A\u17BC \u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u178F\u17CB\u178F\u17D2\u179A\u17B6\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u1791\u17B6\u1793\u17CB\u1796\u17C1\u179B\u179C\u17C1\u179B\u17B6\u17D4",
    type: "ATTENDANCE",
    createdAt: "2026-09-16 11:30",
    read: true,
    priority: "NORMAL"
  },
  {
    id: "notif-04",
    title: "\u1780\u17B6\u179A\u1792\u17D2\u179C\u17BE\u1794\u1785\u17D2\u1785\u17BB\u1794\u17D2\u1794\u1793\u17D2\u1793\u1797\u17B6\u1796\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799 (Cloud Backup)",
    message: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u179A\u1780\u17D2\u179F\u17B6\u1791\u17BB\u1780\u178A\u17C4\u1799\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1793\u17C5\u1798\u17C9\u17C4\u1784 \u17E0\u17E2:\u17E0\u17E0 \u1791\u17C0\u1794\u1797\u17D2\u179B\u17BA\u17D4",
    type: "SYSTEM",
    createdAt: "2026-09-16 02:00",
    read: true,
    priority: "LOW"
  }
];
var INITIAL_ACTIVITIES = [
  {
    id: "act-01",
    action: "\u1794\u17B6\u1793\u1780\u178F\u17CB\u178F\u17D2\u179A\u17B6\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB",
    target: "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780 (\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793 \u17E9/\u17E1\u17E0 \u179F\u17B7\u179F\u17D2\u179F)",
    userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    timeAgo: "\u17E1\u17E5 \u1793\u17B6\u1791\u17B8\u1798\u17BB\u1793",
    type: "ATTENDANCE"
  },
  {
    id: "act-02",
    action: "\u1794\u17B6\u1793\u1794\u1789\u17D2\u1785\u17BC\u179B\u1796\u17B7\u1793\u17D2\u1791\u17BB\u1780\u17B7\u1785\u17D2\u1785\u1780\u17B6\u179A\u179F\u17D2\u179A\u17B6\u179C\u1787\u17D2\u179A\u17B6\u179C\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB",
    target: "\u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A \u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
    userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
    timeAgo: "\u17E4\u17E5 \u1793\u17B6\u1791\u17B8\u1798\u17BB\u1793",
    type: "GRADE"
  },
  {
    id: "act-03",
    action: "\u1794\u17B6\u1793\u1785\u17BB\u17C7\u1788\u17D2\u1798\u17C4\u17C7\u179F\u17B7\u179F\u17D2\u179F\u1790\u17D2\u1798\u17B8",
    target: "\u179F\u17BB\u1781 \u1785\u17B6\u1793\u17CB\u178A\u17B6\u179A\u17C9\u17B6 (KD-2025-001)",
    userName: "\u179B\u17C4\u1780 \u1782\u17B9\u1798 \u179F\u17BB\u1795\u179B",
    timeAgo: "\u17E2 \u1798\u17C9\u17C4\u1784\u1798\u17BB\u1793",
    type: "STUDENT"
  },
  {
    id: "act-04",
    action: "\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782\u1794\u17D2\u179A\u17A1\u1784",
    target: "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784\u1786\u1798\u17B6\u179F\u1791\u17B8\u17E1 \u1782\u178E\u17B7\u178F\u179C\u17B7\u1791\u17D2\u1799\u17B6",
    userName: "\u179B\u17C4\u1780 \u1782\u17B9\u1798 \u179F\u17BB\u1795\u179B",
    timeAgo: "\u17E4 \u1798\u17C9\u17C4\u1784\u1798\u17BB\u1793",
    type: "EXAM"
  },
  {
    id: "act-05",
    action: "\u1794\u17B6\u1793\u1791\u17B6\u1789\u1799\u1780\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u17D2\u1790\u17B7\u178F\u17B7",
    target: "\u179A\u1794\u17B6\u1799\u1780\u17B6\u179A\u178E\u17CD\u179F\u17B7\u179F\u17D2\u179F\u1794\u17D2\u179A\u1785\u17B6\u17C6\u1786\u1798\u17B6\u179F (PDF)",
    userName: "\u17AF\u1780\u17A7\u178F\u17D2\u178F\u1798 \u1794\u178E\u17D2\u178C\u17B7\u178F \u1787\u17B6 \u179F\u17BB\u179C\u178E\u17D2\u178E",
    timeAgo: "\u1798\u17D2\u179F\u17B7\u179B\u1798\u17B7\u1789",
    type: "SYSTEM"
  }
];

// src/lib/studentUtils.ts
function cleanKey(str) {
  return str.toString().trim().toLowerCase().replace(/[\s_\-"'()[\]{}#]/g, "");
}
function parseDateValue(val) {
  if (val === void 0 || val === null || val === "") return "2008-01-01";
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) {
      return val.toISOString().split("T")[0];
    }
  }
  if (typeof val === "number") {
    if (val > 1e3 && val < 6e4) {
      const d = new Date(Math.round((val - 25569) * 86400 * 1e3));
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    }
  }
  const str = String(val).trim();
  const ddmmyyyy = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, "0");
    const month = ddmmyyyy[2].padStart(2, "0");
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }
  const yyyymmdd = str.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})/);
  if (yyyymmdd) {
    const year = yyyymmdd[1];
    const month = yyyymmdd[2].padStart(2, "0");
    const day = yyyymmdd[3].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str || "2008-01-01";
}
function parseSexValue(val) {
  if (!val) return "\u1794\u17D2\u179A\u17BB\u179F";
  const s = String(val).trim().toLowerCase();
  if (s === "\u179F\u17D2\u179A\u17B8" || s === "female" || s === "f" || s === "girl" || s === "woman" || s === "\u179F\u17D2\u179A\u17B8\u17D2\u178F" || s === "\u179F") {
    return "\u179F\u17D2\u179A\u17B8";
  }
  return "\u1794\u17D2\u179A\u17BB\u179F";
}
function normalizeStudentData(raw, index = 1) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const defaultRlc = `RLC-${currentYear}-${index.toString().padStart(3, "0")}`;
  const map = {};
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw)) {
      if (v !== void 0 && v !== null && v !== "") {
        const cleaned = cleanKey(k);
        map[cleaned] = v;
      }
    }
  }
  const rawKhmerName = raw.khmer_name || raw.nameKhmer || map["khmername"] || map["namekhmer"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u1781\u17D2\u1798\u17C2\u179A"] || map["\u1788\u17D2\u1798\u17C4\u17C7"] || map["\u1782\u17C4\u178F\u17D2\u178F\u1793\u17B6\u1798\u1793\u17B7\u1784\u1793\u17B6\u1798"] || map["\u1782\u17C4\u178F\u17D2\u178F\u1793\u17B6\u1798-\u1793\u17B6\u1798"] || map["\u1782\u17C4\u178F\u17D2\u178F\u1793\u17B6\u1798"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u179F\u17B7\u179F\u17D2\u179F"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u1796\u17C1\u1789"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A"] || map["khmer"] || raw.english_name || raw.nameEnglish || map["englishname"] || map["name"] || "";
  const khmer_name = (rawKhmerName || `\u179F\u17B7\u179F\u17D2\u179F #${index}`).toString().trim();
  const rawEnglishName = raw.english_name || raw.nameEnglish || map["englishname"] || map["nameenglish"] || map["latinname"] || map["name"] || map["fullname"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u17A1\u17B6\u178F\u17B6\u17C6\u1784"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F"] || map["\u17A2\u1780\u17D2\u179F\u179A\u17A1\u17B6\u178F\u17B6\u17C6\u1784"] || map["\u1788\u17D2\u1798\u17C4\u17C7\u1787\u17B6\u1797\u17B6\u179F\u17B6\u17A2\u1784\u17CB\u1782\u17D2\u179B\u17C1\u179F"] || map["english"] || "";
  const english_name = (rawEnglishName || khmer_name).toString().trim();
  const rawSex = raw.sex || raw.gender || map["sex"] || map["gender"] || map["\u1797\u17C1\u1791"] || map["gendersex"] || "";
  const sex = parseSexValue(rawSex);
  const rawAge = raw.age !== void 0 && raw.age !== null ? raw.age : map["age"] || map["\u17A2\u17B6\u1799\u17BB"] || "";
  const age = rawAge ? String(rawAge).trim() : "17";
  const rawGrade = raw.grade || raw.className || map["grade"] || map["gradelevel"] || map["class"] || map["classname"] || map["classid"] || map["\u1790\u17D2\u1793\u17B6\u1780\u17CB"] || map["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u179A\u17C0\u1793"] || map["\u1780\u1798\u17D2\u179A\u17B7\u178F"] || map["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1780\u1798\u17D2\u179A\u17B7\u178F"] || "";
  const grade = (rawGrade || "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780").toString().trim();
  const rawDob = raw.date_of_birth || raw.dob || map["dateofbirth"] || map["dob"] || map["birthdate"] || map["\u1790\u17D2\u1784\u17C3\u1781\u17C2\u1786\u17D2\u1793\u17B6\u17C6\u1780\u17C6\u178E\u17BE\u178F"] || map["\u1790\u17D2\u1784\u17C3\u1780\u17C6\u178E\u17BE\u178F"] || map["\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791\u1780\u17C6\u178E\u17BE\u178F"] || "";
  const date_of_birth = parseDateValue(rawDob);
  const rawRlc = raw.rlc || raw.studentCode || map["rlc"] || map["studentcode"] || map["code"] || map["id"] || map["studentid"] || map["\u17A2\u178F\u17D2\u178F\u179B\u17C1\u1781"] || map["\u1780\u17BC\u178A\u179F\u17B7\u179F\u17D2\u179F"] || map["\u1780\u17BC\u178A"] || "";
  const rlc = (rawRlc || defaultRlc).toString().trim();
  const rawPhone = raw.phone_number || raw.phone || map["phonenumber"] || map["phone"] || map["tel"] || map["telephone"] || map["mobile"] || map["\u179B\u17C1\u1781\u1791\u17BC\u179A\u179F\u17D0\u1796\u17D2\u1791"] || map["\u1791\u17BC\u179A\u179F\u17D0\u1796\u17D2\u1791"] || map["\u1791\u17BC\u179A\u179F\u17D0\u1796\u17D2\u1791\u179F\u17B7\u179F\u17D2\u179F"] || "";
  const phone_number = String(rawPhone || "").trim();
  const rawContrib = raw.contributions !== void 0 && raw.contributions !== null ? raw.contributions : map["contributions"] || map["contribution"] || map["fee"] || map["tuition"] || map["\u179C\u17B7\u1797\u17B6\u1782\u1791\u17B6\u1793"] || map["\u1780\u17B6\u179A\u1785\u17BC\u179B\u179A\u17BD\u1798"] || map["\u1790\u17D2\u179B\u17C3\u179F\u17B7\u1780\u17D2\u179F\u17B6"] || "";
  const contributions = String(rawContrib || "").trim();
  const rawRemark = raw.remark !== void 0 && raw.remark !== null ? raw.remark : map["remark"] || map["remarks"] || map["note"] || map["notes"] || map["comment"] || map["\u1785\u17C6\u178E\u17B6\u17C6"] || map["\u179F\u1798\u17D2\u1782\u17B6\u179B\u17CB"] || "";
  const remark = String(rawRemark || "").trim();
  const rawOrther = raw.orther !== void 0 && raw.orther !== null ? raw.orther : raw.other !== void 0 && raw.other !== null ? raw.other : map["orther"] || map["other"] || map["others"] || map["\u1795\u17D2\u179F\u17C1\u1784\u17D7"] || map["\u1795\u17D2\u179F\u17C1\u1784\u1791\u17C0\u178F"] || map["\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1794\u1793\u17D2\u1790\u17C2\u1798"] || "";
  const orther = String(rawOrther || "").trim();
  const rawBooks = raw.books !== void 0 && raw.books !== null ? raw.books : map["books"] || map["book"] || map["textbook"] || map["textbooks"] || map["\u179F\u17C0\u179C\u1797\u17C5"] || map["\u179F\u17C0\u179C\u1797\u17C5\u1796\u17BB\u1798\u17D2\u1796"] || "";
  const books = String(rawBooks || "\u1794\u17B6\u1793\u1791\u1791\u17BD\u179B\u179A\u17BD\u1785").trim();
  const rawTimeStudy = raw.time_study || map["timestudy"] || map["studytime"] || map["shift"] || map["session"] || map["time"] || map["\u1798\u17C9\u17C4\u1784\u179F\u17B7\u1780\u17D2\u179F\u17B6"] || map["\u179C\u17C1\u1793\u179F\u17B7\u1780\u17D2\u179F\u17B6"] || map["\u1798\u17C9\u17C4\u1784"] || "";
  const time_study = (rawTimeStudy || "7:00 - 11:00 AM").toString().trim();
  const rawStatus = raw.status || map["status"] || map["state"] || map["\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796"] || map["\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796\u179F\u17B7\u1780\u17D2\u179F\u17B6"] || "";
  const status = (rawStatus || "\u1780\u17C6\u1796\u17BB\u1784\u179F\u17B7\u1780\u17D2\u179F\u17B6").toString().trim();
  const rawSemester = raw.semester || map["semester"] || map["term"] || map["\u1786\u1798\u17B6\u179F"] || map["\u179C\u1782\u17D2\u1782"] || "";
  const semester = (rawSemester || "\u1786\u1798\u17B6\u179F\u1791\u17B8\u17E1").toString().trim();
  const rawPaymentBy = raw.payment_by || map["paymentby"] || map["payment"] || map["method"] || map["paymentmethod"] || map["\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB\u178F\u17B6\u1798"] || map["\u1780\u17B6\u179A\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB"] || map["\u179C\u17B7\u1792\u17B8\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB"] || map["\u1792\u1793\u17B6\u1782\u17B6\u179A"] || "";
  const payment_by = (rawPaymentBy || "ABA Bank").toString().trim();
  const id = raw.id || `std-${Date.now()}-${index}-${Math.floor(Math.random() * 1e3)}`;
  return {
    id,
    // 16 Exact Schema Fields:
    khmer_name,
    english_name,
    sex,
    age,
    grade,
    date_of_birth,
    rlc,
    phone_number,
    contributions,
    remark,
    orther,
    books,
    time_study,
    status,
    semester,
    payment_by,
    // Aliases for compatibility
    studentCode: rlc,
    nameKhmer: khmer_name,
    nameEnglish: english_name,
    gender: sex === "\u179F\u17D2\u179A\u17B8" ? "FEMALE" : "MALE",
    dob: date_of_birth,
    className: grade,
    classId: raw.classId || "cls-12a",
    phone: phone_number,
    parentName: raw.parentName || "\u17A2\u17B6\u178E\u17B6\u1796\u17D2\u1799\u17B6\u1794\u17B6\u179B",
    parentPhone: raw.parentPhone || phone_number,
    parentRelationship: raw.parentRelationship || "\u17AA\u1796\u17BB\u1780/\u1798\u17D2\u178F\u17B6\u1799",
    address: raw.address || "\u179A\u17B6\u1787\u1792\u17B6\u1793\u17B8\u1797\u17D2\u1793\u17C6\u1796\u17C1\u1789",
    avatarUrl: raw.avatarUrl || "",
    enrolledDate: raw.enrolledDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    gpa: typeof raw.gpa === "number" ? raw.gpa : 3.85
  };
}

// server.ts
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STUDENTS_FILE = import_path.default.join(DATA_DIR, "students.json");
function loadStoredStudents() {
  try {
    if (import_fs.default.existsSync(STUDENTS_FILE)) {
      const content = import_fs.default.readFileSync(STUDENTS_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[Storage] Loaded ${data.length} students from disk cache`);
        return data;
      }
    }
  } catch (err) {
    console.warn("[Storage] Could not read students from disk:", err);
  }
  return [...INITIAL_STUDENTS];
}
function persistStudentsToDisk(data) {
  try {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    import_fs.default.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to persist students to disk:", err);
  }
}
var users = [...INITIAL_USERS];
var classes = [...INITIAL_CLASSES];
var teachers = [...INITIAL_TEACHERS];
var subjects = [...INITIAL_SUBJECTS];
var students = loadStoredStudents();
var attendances = [...INITIAL_ATTENDANCE];
var grades = [...INITIAL_GRADES];
var schedules = [...INITIAL_SCHEDULE];
var exams = [...INITIAL_EXAMS];
var documents = [...INITIAL_DOCUMENTS];
var notifications = [...INITIAL_NOTIFICATIONS];
var activities = [...INITIAL_ACTIVITIES];
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  app.use((err, req, res, next) => {
    if (err && (err.type === "entity.too.large" || err.status === 413)) {
      return res.status(413).json({
        error: "\u1791\u17C6\u17A0\u17C6\u17AF\u1780\u179F\u17B6\u179A\u1792\u17C6\u1796\u17C1\u1780 (Payload too large). \u179F\u17BC\u1798\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F\u17AF\u1780\u179F\u17B6\u179A\u178F\u17BC\u1785\u1787\u17B6\u1784 50MB\u17D4",
        status: 413
      });
    }
    if (err && err.status === 400 && "body" in err) {
      return res.status(400).json({
        error: "\u1791\u1798\u17D2\u179A\u1784\u17CB\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C (Malformed JSON payload)",
        status: 400
      });
    }
    next(err);
  });
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString(), platform: "KrouDigital4.0 Khmer Digital Education" });
  });
  app.post("/api/auth/login", (req, res) => {
    const { username, role } = req.body;
    let foundUser = users.find((u) => u.username.toLowerCase() === (username || "").toLowerCase() || u.email.toLowerCase() === (username || "").toLowerCase());
    if (!foundUser && role) {
      foundUser = users.find((u) => u.role === role);
    }
    if (!foundUser) {
      foundUser = users[0];
    }
    res.json({
      success: true,
      token: "jwt-kroudigital-token-" + Date.now(),
      user: foundUser,
      message: "\u1785\u17BC\u179B\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u178A\u17C4\u1799\u1787\u17C4\u1782\u1787\u17D0\u1799"
    });
  });
  app.get("/api/auth/me", (req, res) => {
    res.json({ user: users[0] });
  });
  app.get("/api/dashboard/stats", (req, res) => {
    const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
    const totalAttendanceRecorded = attendances.length || 1;
    const attendanceRate = Math.round(presentCount / totalAttendanceRecorded * 100);
    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      attendanceRate: attendanceRate || 95,
      upcomingExams: exams.filter((e) => e.status === "SCHEDULED").length,
      activities: activities.slice(0, 8),
      notifications: notifications.slice(0, 5)
    });
  });
  app.get("/api/students", (req, res) => {
    const { search, classId, status } = req.query;
    let result = [...students];
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.khmer_name && s.khmer_name.toLowerCase().includes(q) || s.nameKhmer && s.nameKhmer.toLowerCase().includes(q) || s.english_name && s.english_name.toLowerCase().includes(q) || s.nameEnglish && s.nameEnglish.toLowerCase().includes(q) || s.rlc && s.rlc.toLowerCase().includes(q) || s.studentCode && s.studentCode.toLowerCase().includes(q) || s.grade && s.grade.toLowerCase().includes(q) || s.phone_number && s.phone_number.includes(q) || s.remark && s.remark.toLowerCase().includes(q) || s.orther && s.orther.toLowerCase().includes(q)
      );
    }
    if (classId && typeof classId === "string" && classId !== "ALL") {
      result = result.filter((s) => s.classId === classId || s.grade === classId);
    }
    if (status && typeof status === "string" && status !== "ALL") {
      result = result.filter((s) => s.status === status);
    }
    res.json(result);
  });
  app.post("/api/students", (req, res) => {
    const body = req.body;
    const newStudent = normalizeStudentData(body, students.length + 1);
    students.unshift(newStudent);
    persistStudentsToDisk(students);
    activities.unshift({
      id: "act-" + Date.now(),
      action: "\u1794\u17B6\u1793\u1785\u17BB\u17C7\u1788\u17D2\u1798\u17C4\u17C7\u179F\u17B7\u179F\u17D2\u179F\u1790\u17D2\u1798\u17B8",
      target: `${newStudent.khmer_name} (${newStudent.rlc})`,
      userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6",
      timeAgo: "\u1791\u17BE\u1794\u178F\u17C2\u1794\u1789\u17D2\u1785\u17BC\u179B",
      type: "STUDENT"
    });
    res.status(201).json(newStudent);
  });
  app.get("/api/students/:id", (req, res) => {
    const student = students.find((s) => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u179F\u17B7\u179F\u17D2\u179F" });
    const studentGrades = grades.filter((g) => g.studentId === student.id);
    const studentAttendance = attendances.filter((a) => a.studentId === student.id);
    res.json({ student, grades: studentGrades, attendance: studentAttendance });
  });
  app.put("/api/students/:id", (req, res) => {
    const index = students.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u179F\u17B7\u179F\u17D2\u179F" });
    const updated = normalizeStudentData({ ...students[index], ...req.body }, index + 1);
    students[index] = updated;
    persistStudentsToDisk(students);
    res.json(updated);
  });
  app.delete("/api/students/:id", (req, res) => {
    const index = students.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u179F\u17B7\u179F\u17D2\u179F" });
    const deleted = students.splice(index, 1)[0];
    persistStudentsToDisk(students);
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F\u1787\u17C4\u1782\u1787\u17D0\u1799", deleted });
  });
  app.post("/api/students/import", (req, res) => {
    const importedList = req.body.students;
    if (!Array.isArray(importedList) || importedList.length === 0) {
      return res.status(400).json({ error: "\u1798\u17B7\u1793\u1798\u17B6\u1793\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F\u179F\u1798\u17D2\u179A\u17B6\u1794\u17CB\u1793\u17B6\u17C6\u1785\u17BC\u179B\u17A1\u17BE\u1799" });
    }
    const newStudents = importedList.map((item, idx) => {
      return normalizeStudentData(item, students.length + idx + 1);
    });
    students.unshift(...newStudents);
    persistStudentsToDisk(students);
    activities.unshift({
      id: "act-" + Date.now(),
      action: "\u1794\u17B6\u1793\u1793\u17B6\u17C6\u1785\u17BC\u179B\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F (CSV/Excel)",
      target: `${newStudents.length} \u1793\u17B6\u1780\u17CB \u1787\u17C4\u1782\u1787\u17D0\u1799`,
      userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6",
      timeAgo: "\u1791\u17BE\u1794\u178F\u17C2\u1793\u17B6\u17C6\u1785\u17BC\u179B",
      type: "STUDENT"
    });
    res.status(201).json({
      success: true,
      message: `\u1794\u17B6\u1793\u1793\u17B6\u17C6\u1785\u17BC\u179B\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F\u1785\u17C6\u1793\u17BD\u1793 ${newStudents.length} \u1793\u17B6\u1780\u17CB\u178A\u17C4\u1799\u1787\u17C4\u1782\u1787\u17D0\u1799`,
      count: newStudents.length,
      students: newStudents
    });
  });
  app.delete("/api/students", (req, res) => {
    const count = students.length;
    students = [];
    persistStudentsToDisk([]);
    attendances = [];
    grades = [];
    activities.unshift({
      id: "act-" + Date.now(),
      action: "\u1794\u17B6\u1793\u179F\u1798\u17D2\u17A2\u17B6\u178F\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB",
      target: `${count} \u1793\u17B6\u1780\u17CB`,
      userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6",
      timeAgo: "\u1791\u17BE\u1794\u178F\u17C2\u179B\u17BB\u1794",
      type: "STUDENT"
    });
    res.json({ success: true, message: `\u1794\u17B6\u1793\u179F\u1798\u17D2\u17A2\u17B6\u178F\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u179F\u17B7\u179F\u17D2\u179F\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB (${count} \u1793\u17B6\u1780\u17CB) \u1787\u17C4\u1782\u1787\u17D0\u1799`, count });
  });
  app.get("/api/teachers", (req, res) => {
    res.json(teachers);
  });
  app.post("/api/teachers", (req, res) => {
    const body = req.body;
    const newId = "tch-" + (teachers.length + 1).toString().padStart(3, "0");
    const newTeacher = {
      id: newId,
      teacherCode: `TCH-${(teachers.length + 1).toString().padStart(3, "0")}`,
      nameKhmer: body.nameKhmer || "\u1782\u17D2\u179A\u17BC\u1790\u17D2\u1798\u17B8",
      nameEnglish: body.nameEnglish || "New Teacher",
      gender: body.gender || "MALE",
      email: body.email || "teacher@kroudigital.edu.kh",
      phone: body.phone || "012 333 444",
      department: body.department || "\u179C\u17B7\u1791\u17D2\u1799\u17B6\u179F\u17B6\u179F\u17D2\u178F\u17D2\u179A",
      subjects: body.subjects || ["\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A"],
      degree: body.degree || "\u1794\u179A\u17B7\u1789\u17D2\u1789\u17B6\u1794\u178F\u17D2\u179A",
      status: "ACTIVE",
      joinedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      assignedClassNames: body.assignedClassNames || ["\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780"]
    };
    teachers.unshift(newTeacher);
    res.status(201).json(newTeacher);
  });
  app.put("/api/teachers/:id", (req, res) => {
    const index = teachers.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1782\u17D2\u179A\u17BC" });
    teachers[index] = { ...teachers[index], ...req.body };
    res.json(teachers[index]);
  });
  app.delete("/api/teachers/:id", (req, res) => {
    const index = teachers.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1782\u17D2\u179A\u17BC" });
    const removed = teachers.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1782\u17D2\u179A\u17BC\u1787\u17C4\u1782\u1787\u17D0\u1799", removed });
  });
  app.get("/api/classes", (req, res) => {
    const classesWithCount = classes.map((c) => ({
      ...c,
      studentCount: students.filter((s) => s.classId === c.id).length
    }));
    res.json(classesWithCount);
  });
  app.post("/api/classes", (req, res) => {
    const body = req.body;
    const newId = "cls-" + (classes.length + 1);
    const newClass = {
      id: newId,
      name: body.name || `\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8${body.grade || 12} \u1790\u17D2\u1798\u17B8`,
      grade: Number(body.grade) || 12,
      academicYear: body.academicYear || "\u17E2\u17E0\u17E2\u17E5-\u17E2\u17E0\u17E2\u17E6",
      room: body.room || "\u1794\u1793\u17D2\u1791\u1794\u17CB D401",
      teacherId: body.teacherId || (teachers[0]?.id || "tch-001"),
      teacherName: teachers.find((t) => t.id === body.teacherId)?.nameKhmer || "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
      studentCount: 0,
      capacity: Number(body.capacity) || 35,
      shift: body.shift || "MORNING"
    };
    classes.push(newClass);
    res.status(201).json(newClass);
  });
  app.put("/api/classes/:id", (req, res) => {
    const index = classes.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1790\u17D2\u1793\u17B6\u1780\u17CB\u179A\u17C0\u1793" });
    classes[index] = { ...classes[index], ...req.body };
    res.json(classes[index]);
  });
  app.delete("/api/classes/:id", (req, res) => {
    const index = classes.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1790\u17D2\u1793\u17B6\u1780\u17CB\u179A\u17C0\u1793" });
    const removed = classes.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1790\u17D2\u1793\u17B6\u1780\u17CB\u179A\u17C0\u1793\u1787\u17C4\u1782\u1787\u17D0\u1799", removed });
  });
  app.get("/api/subjects", (req, res) => {
    res.json(subjects);
  });
  app.post("/api/subjects", (req, res) => {
    const body = req.body;
    const newSubject = {
      id: "sbj-" + (subjects.length + 1).toString().padStart(2, "0"),
      code: body.code || `SUB${subjects.length + 1}`,
      nameKhmer: body.nameKhmer || "\u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1790\u17D2\u1798\u17B8",
      nameEnglish: body.nameEnglish || "New Subject",
      credits: Number(body.credits) || 3,
      hoursPerWeek: Number(body.hoursPerWeek) || 4,
      department: body.department || "\u1785\u17C6\u178E\u17C1\u17C7\u1791\u17BC\u1791\u17C5",
      teacherName: body.teacherName || "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
      applicableGrades: body.applicableGrades || [10, 11, 12]
    };
    subjects.push(newSubject);
    res.status(201).json(newSubject);
  });
  app.put("/api/subjects/:id", (req, res) => {
    const index = subjects.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6" });
    subjects[index] = { ...subjects[index], ...req.body };
    res.json(subjects[index]);
  });
  app.delete("/api/subjects/:id", (req, res) => {
    const index = subjects.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6" });
    const removed = subjects.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1798\u17BB\u1781\u179C\u17B7\u1787\u17D2\u1787\u17B6\u1787\u17C4\u1782\u1787\u17D0\u1799", removed });
  });
  app.get("/api/attendance", (req, res) => {
    const { classId, date } = req.query;
    let list = [...attendances];
    if (classId && typeof classId === "string" && classId !== "ALL") {
      list = list.filter((a) => a.classId === classId);
    }
    if (date && typeof date === "string") {
      list = list.filter((a) => a.date === date);
    }
    res.json(list);
  });
  app.post("/api/attendance", (req, res) => {
    const { records } = req.body;
    if (Array.isArray(records)) {
      records.forEach((record) => {
        const idx = attendances.findIndex((a) => a.studentId === record.studentId && a.date === record.date);
        if (idx !== -1) {
          attendances[idx] = { ...attendances[idx], ...record };
        } else {
          attendances.push({ ...record, id: "att-" + Date.now() + Math.random().toString(36).substring(2, 5) });
        }
      });
    }
    activities.unshift({
      id: "act-" + Date.now(),
      action: "\u1794\u17B6\u1793\u1780\u178F\u17CB\u178F\u17D2\u179A\u17B6\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u179F\u17B7\u179F\u17D2\u179F",
      target: `\u1785\u17C6\u1793\u17BD\u1793 ${records?.length || 0} \u1793\u17B6\u1780\u17CB`,
      userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
      timeAgo: "\u1791\u17BE\u1794\u178F\u17C2\u1794\u1789\u17D2\u1785\u17BC\u179B",
      type: "ATTENDANCE"
    });
    res.json({ success: true, message: "\u1794\u17B6\u1793\u1780\u178F\u17CB\u178F\u17D2\u179A\u17B6\u179C\u178F\u17D2\u178F\u1798\u17B6\u1793\u1787\u17C4\u1782\u1787\u17D0\u1799", count: records?.length });
  });
  app.get("/api/grades", (req, res) => {
    const { classId, subjectId } = req.query;
    let list = [...grades];
    if (classId && typeof classId === "string") {
      list = list.filter((g) => g.classId === classId);
    }
    if (subjectId && typeof subjectId === "string") {
      list = list.filter((g) => g.subjectId === subjectId);
    }
    res.json(list);
  });
  app.post("/api/grades", (req, res) => {
    const { gradesList } = req.body;
    if (Array.isArray(gradesList)) {
      gradesList.forEach((gradeItem) => {
        const idx = grades.findIndex((g) => g.id === gradeItem.id || g.studentId === gradeItem.studentId && g.subjectId === gradeItem.subjectId);
        if (idx !== -1) {
          grades[idx] = { ...grades[idx], ...gradeItem };
        } else {
          grades.push({ ...gradeItem, id: "grd-" + Date.now() + Math.random().toString(36).substring(2, 5) });
        }
      });
    }
    activities.unshift({
      id: "act-" + Date.now(),
      action: "\u1794\u17B6\u1793\u1794\u1789\u17D2\u1785\u17BC\u179B\u1796\u17B7\u1793\u17D2\u1791\u17BB\u1790\u17D2\u1798\u17B8",
      target: `\u1785\u17C6\u1793\u17BD\u1793 ${gradesList?.length || 0} \u179F\u17B7\u179F\u17D2\u179F`,
      userName: "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
      timeAgo: "\u1791\u17BE\u1794\u178F\u17C2\u1794\u1789\u17D2\u1785\u17BC\u179B",
      type: "GRADE"
    });
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179A\u1780\u17D2\u179F\u17B6\u1791\u17BB\u1780\u1796\u17B7\u1793\u17D2\u1791\u17BB\u1787\u17C4\u1782\u1787\u17D0\u1799" });
  });
  app.get("/api/schedule", (req, res) => {
    const { classId } = req.query;
    let list = [...schedules];
    if (classId && typeof classId === "string" && classId !== "ALL") {
      list = list.filter((s) => s.classId === classId);
    }
    res.json(list);
  });
  app.post("/api/schedule", (req, res) => {
    const body = req.body;
    const newSchedule = {
      id: "sch-" + Date.now(),
      dayOfWeek: Number(body.dayOfWeek) || 1,
      period: Number(body.period) || 1,
      startTime: body.startTime || "07:30",
      endTime: body.endTime || "08:20",
      classId: body.classId || "cls-12a",
      className: classes.find((c) => c.id === body.classId)?.name || "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
      subjectId: body.subjectId || "sbj-01",
      subjectName: subjects.find((s) => s.id === body.subjectId)?.nameKhmer || "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
      teacherId: body.teacherId || "tch-001",
      teacherName: teachers.find((t) => t.id === body.teacherId)?.nameKhmer || "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u17BC \u1785\u17B6\u1793\u17CB \u179F\u17BB\u1781\u17B6",
      room: body.room || "A101",
      color: body.color || "bg-cyan-50 border-cyan-300 text-cyan-800"
    };
    schedules.push(newSchedule);
    res.status(201).json(newSchedule);
  });
  app.delete("/api/schedule/:id", (req, res) => {
    const index = schedules.findIndex((s) => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1780\u17B6\u179B\u179C\u17B7\u1797\u17B6\u1782" });
    const removed = schedules.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1798\u17C9\u17C4\u1784\u179F\u17B7\u1780\u17D2\u179F\u17B6", removed });
  });
  app.get("/api/exams", (req, res) => {
    res.json(exams);
  });
  app.post("/api/exams", (req, res) => {
    const body = req.body;
    const newExam = {
      id: "exm-" + Date.now(),
      titleKhmer: body.titleKhmer || "\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784\u1790\u17D2\u1798\u17B8",
      titleEnglish: body.titleEnglish || "New Exam",
      examType: body.examType || "MIDTERM",
      subjectId: body.subjectId || "sbj-01",
      subjectName: subjects.find((s) => s.id === body.subjectId)?.nameKhmer || "\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A",
      classId: body.classId || "cls-12a",
      className: classes.find((c) => c.id === body.classId)?.name || "\u1790\u17D2\u1793\u17B6\u1780\u17CB\u1791\u17B8\u17E1\u17E2 \u1780",
      date: body.date || "2026-10-01",
      startTime: body.startTime || "08:00",
      endTime: body.endTime || "10:00",
      durationMinutes: Number(body.durationMinutes) || 120,
      room: body.room || "\u1794\u1793\u17D2\u1791\u1794\u17CB A101",
      totalMarks: Number(body.totalMarks) || 100,
      passMarks: Number(body.passMarks) || 50,
      status: "SCHEDULED"
    };
    exams.unshift(newExam);
    res.status(201).json(newExam);
  });
  app.put("/api/exams/:id", (req, res) => {
    const index = exams.findIndex((e) => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784" });
    exams[index] = { ...exams[index], ...req.body };
    res.json(exams[index]);
  });
  app.delete("/api/exams/:id", (req, res) => {
    const index = exams.findIndex((e) => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784" });
    const removed = exams.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u1780\u17B6\u179A\u1794\u17D2\u179A\u17A1\u1784", removed });
  });
  app.get("/api/drive/config", (req, res) => {
    let clientId = "";
    try {
      const configPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
      if (import_fs.default.existsSync(configPath)) {
        const parsed = JSON.parse(import_fs.default.readFileSync(configPath, "utf8"));
        if (parsed.oAuthClientId) {
          clientId = parsed.oAuthClientId;
        }
      }
    } catch (e) {
      console.warn("Could not read firebase-applet-config.json:", e);
    }
    if (!clientId && process.env.GOOGLE_OAUTH_CLIENT_ID) {
      clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    }
    if (!clientId) {
      clientId = "470039681099-npvjd9nguvogu7qrokofro5ujp5b920m.apps.googleusercontent.com";
    }
    res.json({
      clientId,
      projectId: "gen-lang-client-0742622527",
      projectNumber: "470039681099",
      scope: "https://www.googleapis.com/auth/drive.file"
    });
  });
  app.get("/api/documents", (req, res) => {
    res.json(documents);
  });
  app.post("/api/documents", (req, res) => {
    const body = req.body;
    const newDoc = {
      id: body.id || "doc-" + Date.now(),
      title: body.title || "\u17AF\u1780\u179F\u17B6\u179A\u17A2\u1794\u17CB\u179A\u17C6\u1790\u17D2\u1798\u17B8",
      category: body.category || "CURRICULUM",
      fileType: body.fileType || "PDF",
      fileSize: body.fileSize || "1.5 MB",
      uploadedBy: body.uploadedBy || "\u17A2\u17D2\u1793\u1780\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784\u179F\u17B6\u179B\u17B6",
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      downloadCount: 0,
      isStoredInDrive: Boolean(body.isStoredInDrive),
      driveFileId: body.driveFileId,
      driveWebViewLink: body.driveWebViewLink,
      driveDownloadUrl: body.driveDownloadUrl,
      driveIconLink: body.driveIconLink,
      driveFolderId: body.driveFolderId,
      driveFolderName: body.driveFolderName || "KrouDigital 4.0 - \u1794\u178E\u17D2\u178E\u17B6\u179B\u17D0\u1799\u179F\u17B6\u179B\u17B6"
    };
    documents.unshift(newDoc);
    res.status(201).json(newDoc);
  });
  app.delete("/api/documents/:id", (req, res) => {
    const index = documents.findIndex((d) => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u17AF\u1780\u179F\u17B6\u179A" });
    const removed = documents.splice(index, 1)[0];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179B\u17BB\u1794\u17AF\u1780\u179F\u17B6\u179A\u1787\u17C4\u1782\u1787\u17D0\u1799", removed });
  });
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });
  app.patch("/api/notifications/:id/read", (req, res) => {
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true, notif });
  });
  app.post("/api/notifications", (req, res) => {
    const body = req.body;
    const newNotif = {
      id: "notif-" + Date.now(),
      title: body.title || "\u179F\u17C1\u1785\u1780\u17D2\u178F\u17B8\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784\u1790\u17D2\u1798\u17B8",
      message: body.message || "",
      type: body.type || "ANNOUNCEMENT",
      createdAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
      read: false,
      priority: body.priority || "NORMAL"
    };
    notifications.unshift(newNotif);
    res.status(201).json(newNotif);
  });
  app.post("/api/reset-data", (req, res) => {
    classes = [...INITIAL_CLASSES];
    teachers = [...INITIAL_TEACHERS];
    subjects = [...INITIAL_SUBJECTS];
    students = [...INITIAL_STUDENTS];
    attendances = [...INITIAL_ATTENDANCE];
    grades = [...INITIAL_GRADES];
    schedules = [...INITIAL_SCHEDULE];
    exams = [...INITIAL_EXAMS];
    documents = [...INITIAL_DOCUMENTS];
    notifications = [...INITIAL_NOTIFICATIONS];
    activities = [...INITIAL_ACTIVITIES];
    res.json({ success: true, message: "\u1794\u17B6\u1793\u179F\u17D2\u178F\u17B6\u179A\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1782\u17C6\u179A\u17BC\u178A\u17BE\u1798\u17A1\u17BE\u1784\u179C\u17B7\u1789\u1787\u17C4\u1782\u1787\u17D0\u1799" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} KrouDigital4.0 Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
