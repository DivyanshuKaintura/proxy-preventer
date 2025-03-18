'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const TeacherLoginPage = () => {
    const password = 'teacher123';
    const [passwordInput, setPasswordInput] = useState('');
    const router = useRouter(); // Import from next/navigation

    const handleSubmit = () => {
        if (passwordInput === password) {
            console.log('Login Successful');
            router.push('/teacher'); // Redirect to /teacher
        } else {
            alert('Login Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
                    Teacher Login
                </h1>

                {/* Form */}
                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="Enter the password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="
                            w-full 
                            p-3 
                            border 
                            border-gray-300 
                            rounded-lg 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-blue-400 
                            transition duration-300 
                            text-gray-800 placeholder-gray-400
                            text-sm sm:text-base
                        "
                    />
                    <button
                        onClick={handleSubmit}
                        className="
                            w-full 
                            bg-blue-500 
                            text-white 
                            py-3 
                            rounded-lg 
                            hover:bg-blue-600 
                            transition duration-300 
                            text-sm sm:text-base
                        "
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherLoginPage;
