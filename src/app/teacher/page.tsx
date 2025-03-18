'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TeacherPage = () => {
    const [teacherName, setTeacherName] = useState('');
    const [classCode, setClassCode] = useState('');
    const [googleLink, setGoogleLink] = useState('');
    // const [expirationTime, setExpirationTime] = useState(5);
    const [range, setRange] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

    const handleGenerateCoordinates = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString(),
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get location. Please enable location permissions.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, 'present-class'), {
                teacherName,
                classCode,
                googleLink,
                range,
                // expirationTime,
                coordinates,
                createdAt: serverTimestamp(),
            });
            console.log('Document written with ID: ', docRef.id);

            // Reset form after submission
            setTeacherName('');
            setClassCode('');
            setGoogleLink('');
            // setExpirationTime(5);
            setCoordinates({ lat: '', lng: '' });

            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to submit form');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-8">
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-lg border border-blue-100">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-500 text-white p-2 rounded-lg mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Teacher Panel
                    </h1>
                </div>

                <p className="text-gray-600 text-center mb-6">
                    Create a new class attendance form for your students
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Teacher Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Teacher Name</label>
                        <input
                            type="text"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Enter your name"
                            required
                        />

                    </div>

                    {/* Class Code */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Class Code</label>
                        <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="e.g. MATH101"
                            required
                        />
                    </div>

                    {/* Google Link */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Google Form Link</label>
                        <input
                            type="url"
                            value={googleLink}
                            onChange={(e) => setGoogleLink(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="https://forms.google.com/..."
                            required
                        />
                    </div>

                    {/* Range */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Range</label>
                        <input
                            type="text"
                            value={range}
                            onChange={(e) => {
                                // Allow only numbers
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setRange(value);
                                }
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="100 (in meters)"
                            inputMode="numeric"
                            required
                        />
                    </div>


                    {/* Expiration Time */}
                    {/* <div>
                        <label className="block text-gray-700 font-medium mb-2">Expiration Time</label>
                        <select
                            value={expirationTime}
                            onChange={(e) => setExpirationTime(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition duration-200 text-gray-800 placeholder-gray-400"
                            required
                        >
                            {[5, 10, 15, 30, 60].map((time) => (
                                <option key={time} value={time}>
                                    {time} minutes
                                </option>
                            ))}
                        </select>
                    </div> */}

                    {/* Coordinates */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-gray-700 font-medium">Location Coordinates</label>
                            <button
                                type="button"
                                onClick={handleGenerateCoordinates}
                                className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Get Current Location
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    value={coordinates.lat}
                                    onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                                    placeholder="Latitude"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={coordinates.lng}
                                    onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                                    placeholder="Longitude"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium shadow-md"
                        >
                            Create Class Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherPage;