import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, MapPin, Phone, Home } from 'lucide-react';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const risk = state?.risk || 'Low'; // Default to Low if accessed directly

    const isHighRisk = risk === 'High';

    const theme = isHighRisk ? {
        color: isDarkMode ? 'text-red-400' : 'text-red-600',
        bg: isDarkMode ? 'bg-red-900/20 shadow-red-900/10' : 'bg-red-50 shadow-xl',
        ring: isDarkMode ? 'ring-red-900/30' : 'ring-white',
        border: isDarkMode ? 'border-red-800' : 'border-red-100',
        lucide: 'text-red-500',
        message: 'Risiko Tinggi Terdeteksi',
        description: 'Berdasarkan analisis biomarker akustik, terdapat indikasi pola batuk yang memerlukan pemeriksaan medis lebih lanjut.',
        icon: <AlertTriangle size={64} className="text-red-500" />
    } : {
        color: isDarkMode ? 'text-green-400' : 'text-green-600',
        bg: isDarkMode ? 'bg-green-900/20 shadow-green-900/10' : 'bg-green-50 shadow-xl',
        ring: isDarkMode ? 'ring-green-900/30' : 'ring-white',
        border: isDarkMode ? 'border-green-800' : 'border-green-100',
        lucide: 'text-green-500',
        message: 'Risiko Rendah',
        description: 'Analisis menunjukkan pola pernapasan normal. Tetap jaga kesehatan dan lakukan skrining rutin.',
        icon: <CheckCircle2 size={64} className="text-green-500" />
    };

    return (
        <div className={`min-h-screen flex flex-col p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-hospital-blue-50'}`}>
            <div className={`flex-1 flex flex-col items-center justify-center text-center`}>
                <div className={`p-6 rounded-full ${theme.bg} mb-6 ring-8 ${theme.ring} shadow-xl transition-all`}>
                    {theme.icon}
                </div>

                <h2 className={`text-2xl font-bold ${theme.color} mb-2`}>{theme.message}</h2>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-6 shadow-sm ${isDarkMode ? 'bg-slate-800 text-blue-400 border-slate-700' : 'bg-white text-hospital-blue-400 border-hospital-blue-100'}`}>
                    CONFIDENCE: 94.2%
                </div>

                <p className={`leading-relaxed max-w-xs mb-8 ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-600'}`}>
                    {theme.description}
                </p>

                {/* Action Card */}
                {isHighRisk && (
                    <div className={`w-full rounded-2xl p-4 shadow-lg border mb-6 transition-colors ${isDarkMode ? 'bg-slate-800 border-red-900/50' : 'bg-white border-red-100'}`}>
                        <h3 className={`font-bold text-left mb-3 text-sm ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Rekomendasi Tindakan</h3>

                        <div className="space-y-3">
                            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-hospital-blue-50 hover:bg-hospital-blue-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-hospital-blue-600'}`}>
                                        <MapPin size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Puskesmas Terdekat</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-500'}`}>0.8 km dari lokasi anda</p>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded border ${isDarkMode ? 'bg-slate-600 text-blue-300 border-slate-500' : 'bg-white text-hospital-blue-600 border-hospital-blue-200'}`}>NAVIGASI</div>
                            </button>

                            <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-hospital-blue-50 hover:bg-hospital-blue-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                        <Phone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Konsultasi Dokter</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-500'}`}>HaloDoc / Alodokter</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Button onClick={() => navigate('/dashboard')} variant="secondary" className={`w-full mb-2 ${isDarkMode ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : ''}`}>
                <Home className="mr-2" size={20} />
                Kembali ke Beranda
            </Button>
        </div>
    );
};

export default Result;
