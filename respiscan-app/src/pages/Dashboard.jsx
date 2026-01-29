import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Activity, Bell, ChevronRight, Play } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import HealthGauge from '../components/HealthGauge';
import SparkLine from '../components/SparkLine';
import BreathingExercise from '../components/BreathingExercise';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user] = useState({ name: 'Gibran', healthScore: 85 });

    // Mock Data
    const trendsData = [
        { name: 'Mon', score: 70 },
        { name: 'Tue', score: 75 },
        { name: 'Wed', score: 72 },
        { name: 'Thu', score: 80 },
        { name: 'Fri', score: 85 },
        { name: 'Sat', score: 82 },
        { name: 'Sun', score: 88 },
    ];

    const respRateData = [16, 17, 16, 18, 17, 19, 18];
    const aqiData = [40, 45, 42, 50, 48, 55, 60];

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-hospital-blue-50 relative pb-32 overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-hospital-blue-900 to-hospital-blue-50 -z-10" />

            {/* Header */}
            <header className="px-6 pt-12 pb-6 flex justify-between items-center text-white">
                <div>
                    <p className="text-hospital-blue-200 text-xs font-medium uppercase tracking-wider">Welcome back,</p>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                </div>
                <div className="relative">
                    <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                        <Bell size={20} />
                    </button>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-hospital-blue-900"></span>
                </div>
            </header>

            <motion.div
                className="px-6 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero: Health Score */}
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 text-white shadow-glass relative overflow-hidden">
                    <div className="flex flex-col items-center">
                        <HealthGauge score={user.healthScore} />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/record')}
                            className="mt-6 w-full py-4 bg-white text-hospital-blue-900 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 group animate-pulse-slow"
                        >
                            <div className="w-8 h-8 rounded-full bg-hospital-blue-100 flex items-center justify-center group-hover:bg-hospital-blue-200">
                                <Play size={16} className="fill-current text-hospital-blue-600 ml-0.5" />
                            </div>
                            Start New Scan
                        </motion.button>
                    </div>
                </motion.div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Wind size={20} />
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Normal</span>
                        </div>
                        <h3 className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Resp. Rate</h3>
                        <p className="text-2xl font-bold text-slate-800 mb-2">18 <span className="text-sm font-normal text-slate-400">bpm</span></p>
                        <SparkLine data={respRateData} color="#3b82f6" />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <Activity size={20} />
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Moderate</span>
                        </div>
                        <h3 className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Air Quality</h3>
                        <p className="text-2xl font-bold text-slate-800 mb-2">48 <span className="text-sm font-normal text-slate-400">AQI</span></p>
                        <SparkLine data={aqiData} color="#a855f7" />
                    </motion.div>
                </div>

                {/* Breathing Exercise */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                    <BreathingExercise />
                </motion.div>

                {/* Trends Chart */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-hospital-blue-900">Weekly Health Trends</h3>
                        <button className="text-xs text-hospital-blue-500 font-bold flex items-center">
                            Details <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendsData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis hide domain={[60, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </motion.div>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
