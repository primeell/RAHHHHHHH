import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BreathingExercise = () => {
    const { isDarkMode } = useTheme();
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
    const [text, setText] = useState('Mulai');

    React.useEffect(() => {
        let timer;
        if (isActive) {
            const cycle = async () => {
                // Inhale (4s)
                setPhase('inhale');
                setText('Menghirup...');
                await new Promise(r => setTimeout(r, 4000));

                if (!isActive) return;

                // Hold (4s)
                setPhase('hold');
                setText('Tahan...');
                await new Promise(r => setTimeout(r, 4000));

                if (!isActive) return;

                // Exhale (4s)
                setPhase('exhale');
                setText('Lepaskan...');
                await new Promise(r => setTimeout(r, 4000));
            };

            cycle(); // Initial run
            timer = setInterval(cycle, 12000); // 4+4+4 = 12s total cycle
        } else {
            setPhase('idle');
            setText('Mulai');
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isActive]);

    // Animation Variants
    const circleVariants = {
        idle: { scale: 1, opacity: 0.5 },
        inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
        hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
        exhale: { scale: 1, opacity: 0.5, transition: { duration: 4, ease: "easeInOut" } }
    };

    const textVariants = {
        idle: { scale: 1 },
        inhale: { scale: 1.2, transition: { duration: 4 } },
        hold: { scale: 1.2 },
        exhale: { scale: 1, transition: { duration: 4 } }
    };

    return (
        <div className={`backdrop-blur-sm rounded-3xl p-6 border shadow-glass relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-white/50'}`}>
            <div className="flex justify-between items-center z-10 relative">
                <div>
                    <h3 className={`font-bold text-lg transition-colors ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Latihan Pernapasan</h3>
                    <p className={`text-xs transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rilekskan paru-paru (Teknik 4-4-4)</p>
                </div>
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors z-20 ${isDarkMode ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' : 'bg-hospital-blue-100 text-hospital-blue-600 hover:bg-hospital-blue-200'}`}
                >
                    {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
            </div>

            {/* Animation Area */}
            <div className="h-40 flex flex-col items-center justify-center mt-4 relative">
                <div className="relative flex items-center justify-center">
                    {/* Outer Pulse Circle */}
                    <motion.div
                        className={`w-24 h-24 rounded-full absolute transition-colors duration-300 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/50'}`}
                        animate={phase}
                        variants={circleVariants}
                    />

                    {/* Core Circle */}
                    <motion.div
                        className={`w-20 h-20 rounded-full shadow-glow flex items-center justify-center text-white font-bold z-10 bg-gradient-to-br ${isDarkMode ? 'from-blue-600 to-indigo-700' : 'from-hospital-blue-400 to-hospital-blue-600'}`}
                        animate={phase}
                        variants={textVariants}
                    >
                        <span className="text-sm font-medium">{text}</span>
                    </motion.div>
                </div>

                {isActive && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={text}
                        className={`text-sm font-semibold mt-6 absolute bottom-0 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-hospital-blue-500'}`}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default BreathingExercise;
