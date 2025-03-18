import Link from 'next/link';

const TeacherOrStudentPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Teacher or Student Page</h1>
        <p className="text-gray-600 mb-8">Are you a teacher or a student?</p>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/student" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center">
            Student
          </Link>
          
          <Link href="/teacher-login" className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center">
            Teacher
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherOrStudentPage;