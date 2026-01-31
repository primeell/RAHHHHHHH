import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-glass relative overflow-hidden">
            <div className="flex justify-between items-center z-10 relative">
                <div>
                    <h3 className="text-hospital-blue-900 font-bold text-lg">Breathing Exercise</h3>
                    <p className="text-slate-500 text-xs">Relax your lungs (2 min)</p>
                </div>
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-10 h-10 rounded-full bg-hospital-blue-100 flex items-center justify-center text-hospital-blue-600 hover:bg-hospital-blue-200 transition-colors"
                >
                    {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" ml={1} />}
                </button>
            </div>

            {/* Animation Area */}
            <div className="h-32 flex items-center justify-center mt-4">
                <div className="relative flex items-center justify-center">
                    {/* Outer Circle (Breath In/Out) */}
                    <motion.div
                        className="w-24 h-24 rounded-full bg-blue-100/50 absolute"
                        animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] } : { scale: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Core Circle */}
                    <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-hospital-blue-400 to-hospital-blue-600 shadow-glow flex items-center justify-center text-white font-bold"
                        animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {isActive ? <span className="text-xs">Breathe</span> : <span className="text-xs">Start</span>}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BreathingExercise;
