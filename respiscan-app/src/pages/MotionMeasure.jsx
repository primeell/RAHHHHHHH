import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, RefreshCw, Activity } from 'lucide-react';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

const MotionMeasure = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [breaths, setBreaths] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(null);
    const [accParams, setAccParams] = useState({ x: 0, y: 0, z: 0 });

    // Algorithm parameters
    const lastZ = useRef(0);
    const trend = useRef(0); // 1 = up, -1 = down
    const threshold = 0.2; // Sensitivity for breath detection

    useEffect(() => {
        let timer;
        if (isMeasuring && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            finishMeasurement();
        }
        return () => clearInterval(timer);
    }, [isMeasuring, timeLeft]);

    const handleMotion = (event) => {
        if (!isMeasuring) return;

        const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        setAccParams({ x, y, z });

        // Simple peak detection logic for chest rise/fall (z-axis usually)
        // This is a basic simplified algorithm for demonstration
        const delta = Math.abs(z - lastZ.current);

        if (delta > threshold) {
            // Check for direction change
            const currentTrend = z > lastZ.current ? 1 : -1;

            if (trend.current !== 0 && currentTrend !== trend.current) {
                // Direction changed, count as half breath (inhale or exhale peak)
                // We count full cycles in a real app, here we increment on "inhale" starts roughly
                if (currentTrend === 1) {
                    setBreaths(prev => prev + 1);
                }
            }
            trend.current = currentTrend;
        }
        lastZ.current = z;
    };

    const startMeasurement = () => {
        setIsComplete(false);
        setBreaths(0);
        setTimeLeft(60);
        setError(null);

        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        setIsMeasuring(true);
                        window.addEventListener('devicemotion', handleMotion);
                    } else {
                        setError("Permission denied");
                    }
                })
                .catch(e => setError("Error requesting permission: " + e.message));
        } else if ('DeviceMotionEvent' in window) {
            // Non-iOS 13+ devices
            setIsMeasuring(true);
            window.addEventListener('devicemotion', handleMotion);
        } else {
            setError("Device motion not supported on this device.");
        }
    };

    const stopMeasurement = () => {
        setIsMeasuring(false);
        window.removeEventListener('devicemotion', handleMotion);
    };

    const finishMeasurement = () => {
        stopMeasurement();
        setIsComplete(true);
        saveResult(breaths);
    };

    const saveResult = (finalRate) => {
        try {
            const saved = localStorage.getItem('respi_user');
            if (saved) {
                const user = JSON.parse(saved);
                const updatedUser = { ...user, lastRespRate: finalRate, lastRespDate: new Date().toISOString() };
                localStorage.setItem('respi_user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error("Failed to save result", e);
        }
    };

    // Simulation for desktop testing
    const simulateBreath = () => {
        if (!isMeasuring) {
            setIsMeasuring(true);
            setTimeLeft(60);
            setBreaths(0);
            setIsComplete(false);
        }

        // Simulates a breath every ~4 seconds (15 breaths/min)
        const simInterval = setInterval(() => {
            setBreaths(b => b + 1);
        }, 4000);

        setTimeout(() => {
            clearInterval(simInterval);
            if (isMeasuring) { // Check if not manually stopped
                // Logic handled by timer effect, but force consistent state here if needed
            }
        }, 60000);
    };

    return (
        <div className={`min-h-screen flex flex-col p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-hospital-blue-50 text-hospital-blue-900'}`}>
            <header className="flex items-center mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-hospital-blue-100'}`}
                >
                    <ChevronLeft />
                </button>
                <h1 className="text-xl font-bold ml-4">Laju Pernapasan</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className={`w-64 h-64 rounded-full flex items-center justify-center relative transition-colors duration-500 ${isMeasuring ? 'animate-pulse' : ''} ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-xl'}`}>
                    {isMeasuring && (
                        <div className="absolute inset-0 border-4 border-medical-teal-500 rounded-full animate-ping opacity-20"></div>
                    )}
                    <div className="text-center">
                        <Activity size={48} className={`mx-auto mb-2 ${isMeasuring ? 'text-medical-teal-500 animate-bounce' : 'text-slate-400'}`} />
                        <h2 className="text-4xl font-bold">{isComplete ? breaths : timeLeft}</h2>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-400'}`}>
                            {isComplete ? 'Napas / menit' : (isMeasuring ? 'Detik tersisa' : 'Siap')}
                        </p>
                    </div>
                </div>

                {!isMeasuring && !isComplete && (
                    <div className="text-center max-w-xs">
                        <p className="mb-6 opacity-80">
                            Berbaringlah dengan nyaman. Letakkan ponsel di dada Anda. Tekan mulai dan bernapaslah dengan normal selama 1 menit.
                        </p>
                        <div className="space-y-4">
                            <Button onClick={startMeasurement} className="w-full">
                                <Play className="mr-2 w-5 h-5" /> Mulai Pengukuran
                            </Button>
                            {/* Fallback for desktop */}
                            <button onClick={simulateBreath} className="text-xs underline opacity-50 hover:opacity-100">
                                Simulasi (Mode Desktop)
                            </button>
                        </div>
                    </div>
                )}

                {isMeasuring && (
                    <div className="text-center">
                        <p className="animate-pulse">Mengukur...</p>
                        <button onClick={finishMeasurement} className="mt-8 text-sm text-red-500 font-bold">Berhenti Lebih Awal</button>
                    </div>
                )}

                {isComplete && (
                    <div className="w-full max-w-xs space-y-4 animate-fade-in">
                        <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow'}`}>
                            <p className="text-sm opacity-60">Hasil</p>
                            <p className="text-xl font-bold text-medical-teal-500">{breaths} bpm</p>
                            <p className="text-xs mt-1">Rentang normal: 12-20 bpm</p>
                        </div>
                        <Button onClick={() => navigate('/dashboard')} className="w-full">
                            Kembali ke Beranda
                        </Button>
                        <Button variant="secondary" onClick={() => { setIsComplete(false); setBreaths(0); setTimeLeft(60); }} className="w-full">
                            <RefreshCw className="mr-2 w-5 h-5" /> Coba Lagi
                        </Button>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-xl text-sm max-w-xs text-center">
                        {error}
                        <button onClick={simulateBreath} className="block mx-auto mt-2 underline font-bold">Try Simulation</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MotionMeasure;
