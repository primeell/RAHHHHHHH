import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LungMascot = ({ darkMode }) => {
    const tips = [
        "Inhale deeply through your nose, exhale slowly through your mouth.",
        "Stay hydrated! Water helps thin the mucus lining your airways and lungs.",
        "Avoid smoking and second-hand smoke to keep us pink and healthy!",
        "Regular exercise improves your lung capacity and overall health.",
        "Keep your indoor air clean by reducing dust and using air purifiers.",
        "Practice diaphragmatic breathing to strengthen your breathing muscles.",
        "Laughing is a great workout for your abdominal muscles and lungs!"
    ];

    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 8000); // Change tip every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`rounded-3xl p-6 shadow-sm border relative overflow-hidden transition-colors duration-300 mt-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-6">
                {/* Character Animation */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex-shrink-0"
                >
                    <img
                        src="/lung_mascot.png"
                        alt="Happy Lung Mascot"
                        className="w-24 h-24 object-contain drop-shadow-md"
                    />
                </motion.div>

                {/* Speech Bubble */}
                <div className="flex-1 relative">
                    <div className={`p-4 rounded-2xl rounded-tl-none relative ${darkMode ? 'bg-indigo-900/50 text-indigo-100' : 'bg-indigo-50 text-indigo-800'}`}>
                        <h4 className="font-bold text-sm mb-1">Dr. Lung says:</h4>
                        <AnimatePresence mode='wait'>
                            <motion.p
                                key={currentTip}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm leading-relaxed"
                            >
                                "{tips[currentTip]}"
                            </motion.p>
                        </AnimatePresence>

                        {/* Bubble Triangle */}
                        <div className={`absolute -left-2 top-4 w-4 h-4 transform rotate-45 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LungMascot;
