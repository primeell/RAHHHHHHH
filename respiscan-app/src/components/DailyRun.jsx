import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, CheckCircle2 } from 'lucide-react';

import { useFitness } from '../context/FitnessContext';

const DailyRun = ({ darkMode }) => {
    // Get data from context
    const { runTargetKm, runCurrentKm, updateRunProgress } = useFitness();
    const progress = Math.min((runCurrentKm / runTargetKm) * 100, 100);

    // Internal motion state
    const [isActive, setIsActive] = React.useState(false);
    const [steps, setSteps] = React.useState(0);
    const lastY = React.useRef(0);
    const lastTimestamp = React.useRef(0);

    // Auto-start motion tracking
    React.useEffect(() => {
        const handleMotion = (event) => {
            const now = Date.now();
            if (now - lastTimestamp.current < 250) return; // Debounce

            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const y = acc.y || 0;
            const threshold = 2.0; // Sensitivity

            if (Math.abs(y - lastY.current) > threshold) {
                setSteps(prev => {
                    const newSteps = prev + 1;
                    // Approx 0.7m per step => 0.0007 km
                    const addedDist = 0.0007;
                    // Update global context periodically or immediately
                    // For smoothness, we'll update context directly here
                    const newTotal = runCurrentKm + addedDist;
                    updateRunProgress(parseFloat(newTotal.toFixed(3)));
                    return newSteps;
                });
                lastTimestamp.current = now;
                setIsActive(true);

                // Reset active indicator after inactivity
                if (window.motionTimeout) clearTimeout(window.motionTimeout);
                window.motionTimeout = setTimeout(() => setIsActive(false), 2000);
            }
            lastY.current = y;
        };

        // Check permission if needed (iOS 13+)
        if (typeof DeviceMotionEvent !== 'undefined') {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            window.addEventListener('devicemotion', handleMotion);
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('devicemotion', handleMotion);
            }
        }

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [runCurrentKm, updateRunProgress]); // Deps ensure logic uses fresh state if needed, but context update is safer

    return (
        <div className={`rounded-3xl p-6 border shadow-sm relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                    <Footprints size={20} />
                </div>
                <div className="flex gap-2">
                    {isActive && (
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        Target Harian
                    </span>
                </div>
            </div>

            <div className="mb-2">
                <h3 className={`text-xs uppercase font-bold tracking-wider mb-1 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Jarak Tempuh
                </h3>
                <div className="flex flex-col gap-1">
                    <p className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {runCurrentKm.toFixed(2)} KM <span className={`text-sm font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>/ {runTargetKm} KM</span>
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {steps} langkah terdeteksi sesi ini
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                <div className={`absolute top-0 left-0 h-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`} style={{ width: '100%' }} />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                />
            </div>

            <div className="flex justify-between items-center mt-2">
                <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {Math.max(0, runTargetKm - runCurrentKm).toFixed(2)} KM lagi
                </p>
                {isActive && <span className="text-[10px] text-green-500 animate-pulse font-bold">Bergerak...</span>}
            </div>
        </div>
    );
};

export default DailyRun;
