import Image from "next/image";
import Link from "next/link";
import StudentPage from "./student/page";
import TeacherPage from "./teacher/page";
import TeacherOrStudentPage from "@/components/home/teacher-or-student/page";

export default function Home() {
  return (
    <div>
      <TeacherOrStudentPage />
    </div>
  );
}
