'use client';

import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useRouter } from 'next/router';

const StudentPage = () => {
    const [classCode, setClassCode] = useState('');

    // const router = useRouter();

    const handleAccessForm = async () => {
        if (!classCode) {
            alert('Please enter a class code');
            return;
        }

        try {
            // Query Firestore to check if class code exists
            const q = query(collection(db, 'present-class'), where('classCode', '==', classCode));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const googleLink = doc.data().googleLink;
                const coordinates = doc.data().coordinates; // { lat, lng }
                const range = doc.data().range;
                console.log('coordinates:', coordinates);

                if (!coordinates || !coordinates.lat || !coordinates.lng) {
                    alert('Invalid class coordinates');
                    return;
                }

                // Get current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLng = position.coords.longitude;

                            const distance = getDistanceFromLatLonInMeters(
                                userLat,
                                userLng,
                                coordinates.lat,
                                coordinates.lng
                            );

                            console.log(`Distance: ${distance} meters`);

                            if (distance <= Number(range)) {
                                if (googleLink) {
                                    window.location.href = googleLink;
                                } else {
                                    alert('Google Form link not found');
                                }
                            } else {
                                alert(`You are too far from the classroom. Distance: ${Math.round(distance)} meters`);
                            }
                        },
                        (error) => {
                            console.error('Error getting location:', error);
                            alert('Failed to get current location. Please enable location services.');
                        }
                    );
                } else {
                    alert('Geolocation is not supported by your browser.');
                }
            } else {
                alert('Invalid class code');
            }
        } catch (error) {
            console.error('Error checking class code:', error);
            alert('Failed to verify class code');
        }
    };

    // Haversine formula to calculate distance between two coordinates in meters
    const getDistanceFromLatLonInMeters = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const R = 6371000; // Radius of the Earth in meters
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters
        return distance;
    };

    // Convert degrees to radians
    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
                    Student Attendance
                </h1>

                {/* Class Code Input */}
                <div className="space-y-4">
                    <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Enter class code"
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
              placeholder-gray-400 
              text-gray-800 
              text-sm sm:text-base
            "
                    />

                    {/* Access Button */}
                    <button
                        onClick={handleAccessForm}
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
                        Access the Attendance Form
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentPage;
