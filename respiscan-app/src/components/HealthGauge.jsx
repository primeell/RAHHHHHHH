import React from 'react';
import { motion } from 'framer-motion';

const HealthGauge = ({ score = 85 }) => {
    // 8a. Calculate circumference for stroke-dasharray (r=45, C = 2*pi*45 ≈ 283)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    // Color logic
    const getColor = (s) => {
        if (s >= 80) return "#10B981"; // Emerald 500
        if (s >= 50) return "#F59E0B"; // Amber 500
        return "#EF4444"; // Red 500
    };

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="18"
                    fill="transparent"
                />

                {/* Progress Circle */}
                <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke={getColor(score)}
                    strokeWidth="18"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Content */}
            <div className="absolute flex flex-col items-center justify-center text-hospital-blue-900">
                <span className="text-sm font-medium opacity-80">Health Score</span>
                <span className="text-5xl font-bold tracking-tighter">{score}</span>
                <span className="text-xs opacity-60 mt-1">Excellent</span>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-medical-teal-500 blur-3xl opacity-20 pointer-events-none"></div>
        </div>
    );
};

export default HealthGauge;
