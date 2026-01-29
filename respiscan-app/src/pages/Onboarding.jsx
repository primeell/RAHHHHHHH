import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Onboarding = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleStart = (e) => {
        e.preventDefault();
        if (name) {
            localStorage.setItem('respi_user', JSON.stringify({ name, age }));
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-hospital-blue-50 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-hospital-blue-100 to-transparent -z-10 rounded-b-[50px] transform scale-110"></div>

            <div className="flex-1 flex flex-col justify-center px-6 py-10 z-10">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-sm w-16 h-16 flex items-center justify-center mb-6 self-center animate-bounce">
                    <Activity className="w-8 h-8 text-medical-teal-500" />
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-hospital-blue-950 mb-2 tracking-tight">
                        RespiScan AI
                    </h1>
                    <p className="text-hospital-blue-600">
                        Skrining Tuberkulosis Mandiri dengan Kecerdasan Buatan
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-hospital-blue-900/5 mb-8 border border-hospital-blue-100">
                    <form onSubmit={handleStart} className="space-y-4">
                        <Input
                            label="Nama Lengkap"
                            placeholder="Masukkan nama anda"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Usia"
                            placeholder="Contoh: 25"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />

                        <Button type="submit" className="w-full mt-4 group">
                            Mulai Skrining
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-2xl border border-white flex flex-col items-center text-center">
                        <div className="bg-blue-100 p-2 rounded-full mb-2 text-hospital-blue-600">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xs font-semibold text-hospital-blue-800">Privasi Terjaga</span>
                    </div>
                    <div className="bg-white/50 p-4 rounded-2xl border border-white flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-2 rounded-full mb-2 text-medical-teal-500">
                            <Mic size={20} />
                        </div>
                        <span className="text-xs font-semibold text-hospital-blue-800">Analisis Suara</span>
                    </div>
                </div>
            </div>

            <div className="p-6 text-center text-xs text-hospital-blue-400">
                &copy; 2026 Universitas Dinamika
            </div>
        </div>
    );
};

export default Onboarding;
