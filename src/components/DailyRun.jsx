import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, CheckCircle2 } from 'lucide-react';

import { useFitness } from '../context/FitnessContext';

const DailyRun = ({ darkMode }) => {
    // Get data from context
    const { runTargetKm, runCurrentKm } = useFitness();
    const progress = (runCurrentKm / runTargetKm) * 100;

    return (
        <div className={`rounded-3xl p-6 border shadow-sm relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                    <Footprints size={20} />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    Daily Goal
                </span>
            </div>

            <div className="mb-2">
                <h3 className={`text-xs uppercase font-bold tracking-wider mb-1 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Daily Target
                </h3>
                <div className="flex flex-col gap-1">
                    <p className={`text-xl font-bold transition-colors ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {runTargetKm} KM <span className={`text-sm font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>daily</span>
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        or 20 minutes of running
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                <div className={`absolute top-0 left-0 h-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`} style={{ width: '100%' }} />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                />
            </div>

            <p className={`text-[10px] mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {(runTargetKm - runCurrentKm).toFixed(1)} KM to go today
            </p>
        </div>
    );
};

export default DailyRun;
