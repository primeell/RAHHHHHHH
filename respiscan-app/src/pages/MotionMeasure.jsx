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
                {/* Dynamic Visualizer Area */}
                <div className={`relative w-72 h-72 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isMeasuring ? 'scale-110' : 'scale-100'} ${isDarkMode ? 'bg-slate-800 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-white shadow-2xl'}`}>

                    {/* Ring Animations */}
                    {isMeasuring && (
                        <>
                            <div className="absolute inset-0 rounded-full border-4 border-medical-teal-500/30 animate-ping-slow"></div>
                            <div className="absolute inset-4 rounded-full border-2 border-medical-teal-500/20 animate-pulse"></div>
                        </>
                    )}

                    {/* Central Content */}
                    <div className="z-10 text-center flex flex-col items-center">
                        {isMeasuring ? (
                            <>
                                <div className="flex items-end h-16 space-x-1 mb-4">
                                    {/* Simulated Wave Bars */}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-medical-teal-500 rounded-full animate-wave"
                                            style={{
                                                height: `${20 + Math.random() * 40}px`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        ></div>
                                    ))}
                                </div>
                                <h1 className="text-6xl font-bold tabular-nums tracking-tighter text-medical-teal-500">{timeLeft}</h1>
                                <p className={`text-xs uppercase tracking-widest mt-2 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Detik Tersisa</p>
                            </>
                        ) : (
                            <>
                                <Activity size={64} className={`mb-4 ${isDarkMode ? 'text-slate-600' : 'text-hospital-blue-200'}`} />
                                <p className={`text-sm font-semibold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Siap Mengukur</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Status / Instructions */}
                {!isMeasuring && !isComplete && (
                    <div className="w-full max-w-sm space-y-6">
                        {/* Steps Card */}
                        <div className={`p-6 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-hospital-blue-100'}`}>
                            <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Instruksi Pengukuran</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                    <p className={`text-sm leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Berbaring telentang di tempat yang nyaman dan tenang.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                    <p className={`text-sm leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Letakkan ponsel di tengah dada Anda (pastikan layar menghadap atas).</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                    <p className={`text-sm leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tekan tombol Mulai, lalu bernapas normal selama 60 detik.</p>
                                </li>
                            </ul>
                        </div>

                        <Button onClick={startMeasurement} className="w-full py-4 text-lg shadow-lg shadow-medical-teal-500/20">
                            <Play className="mr-2 w-5 h-5 fill-current" /> Mulai Pengukuran
                        </Button>

                        {/* Fallback for desktop */}
                        <button onClick={simulateBreath} className="w-full text-center text-xs underline opacity-40 hover:opacity-100">
                            Simulasi (Mode Desktop)
                        </button>
                    </div>
                )}

                {isMeasuring && (
                    <div className="text-center w-full max-w-xs animate-fade-in">
                        <div className={`p-4 rounded-xl mb-6 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-blue-100'}`}>
                            <p className={`text-xs font-mono mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>SENSOR MOTION DETECTED</p>
                            <div className="flex justify-center gap-4 text-xs font-mono">
                                <span className="text-red-400">X: {accParams.x.toFixed(2)}</span>
                                <span className="text-green-400">Y: {accParams.y.toFixed(2)}</span>
                                <span className="text-blue-400">Z: {accParams.z.toFixed(2)}</span>
                            </div>
                        </div>
                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-600'}`}>
                            Bernapaslah dengan santai...
                        </p>
                        <Button variant="danger" onClick={finishMeasurement} className="w-full opacity-80 hover:opacity-100">
                            Berhenti
                        </Button>
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
