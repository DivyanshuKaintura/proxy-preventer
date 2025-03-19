'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const StudentPage = () => {
    const [classCode, setClassCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [positionError, setPositionError] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState<boolean>(true);

    // Request geolocation permission early
    useEffect(() => {
        if (navigator.geolocation) {
            setIsGettingLocation(true);
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setPosition(pos);
                    setPositionError(null);
                    setIsGettingLocation(false);
                },
                (err) => {
                    setPositionError(`Geolocation error: ${err.message}`);
                    setIsGettingLocation(false);
                },
                { enableHighAccuracy: true, maximumAge: 30000 }
            );
            
            // Cleanup function to remove the watcher
            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setPositionError("Your browser doesn't support geolocation");
            setIsGettingLocation(false);
        }
    }, []);

    // Memoized distance calculation function
    const getDistanceFromLatLonInMeters = useCallback((
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    const handleAccessForm = async () => {
        if (!classCode) {
            alert('Please enter a class code');
            return;
        }

        if (!position) {
            if (positionError) {
                alert(positionError);
            } else {
                alert('Waiting for your location. Please try again in a moment.');
            }
            return;
        }

        setIsLoading(true);

        try {
            // Query Firestore for the class code
            const q = query(
                collection(db, 'present-class'), 
                where('classCode', '==', classCode), 
                limit(1)
            );
            
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const classData = doc.data();
                const { googleLink, coordinates, range } = classData;

                if (!coordinates || !coordinates.lat || !coordinates.lng) {
                    alert('Invalid class coordinates');
                    setIsLoading(false);
                    return;
                }

                const distance = getDistanceFromLatLonInMeters(
                    position.coords.latitude,
                    position.coords.longitude,
                    coordinates.lat,
                    coordinates.lng
                );

                if (distance <= Number(range)) {
                    if (googleLink) {
                        window.location.href = googleLink;
                    } else {
                        alert('Google Form link not found');
                    }
                } else {
                    alert(`You are too far from the classroom. Distance: ${Math.round(distance)} meters`);
                }
            } else {
                alert('Invalid class code');
            }
        } catch (error) {
            console.error('Error checking class code:', error);
            alert('Failed to verify class code');
        } finally {
            setIsLoading(false);
        }
    };

    // Determine button state
    const isButtonDisabled = isLoading || position === null || isGettingLocation;
    
    // Button text based on state
    const getButtonText = () => {
        if (isLoading) return 'Processing...';
        if (isGettingLocation) return 'Getting location...';
        return 'Access the Attendance Form';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
                    Student Attendance
                </h1>

                {/* Only show error message if there is one */}
                {positionError && (
                    <div className="mb-4 text-red-500 text-sm text-center">
                        {positionError}
                    </div>
                )}

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
                        disabled={isLoading}
                    />

                    {/* Access Button */}
                    <button
                        onClick={handleAccessForm}
                        className={`
                            w-full 
                            py-3 
                            rounded-lg 
                            transition duration-300 
                            text-sm sm:text-base
                            text-white
                            ${isButtonDisabled 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'}
                        `}
                        disabled={isButtonDisabled}
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentPage;