import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, MapPin, Phone, Home } from 'lucide-react';
import Button from '../components/Button';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const risk = state?.risk || 'Low'; // Default to Low if accessed directly

    const isHighRisk = risk === 'High';

    const theme = isHighRisk ? {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-100',
        lucide: 'text-red-500',
        message: 'Risiko Tinggi Terdeteksi',
        description: 'Berdasarkan analisis biomarker akustik, terdapat indikasi pola batuk yang memerlukan pemeriksaan medis lebih lanjut.',
        icon: <AlertTriangle size={64} className="text-red-500" />
    } : {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-100',
        lucide: 'text-green-500',
        message: 'Risiko Rendah',
        description: 'Analisis menunjukkan pola pernapasan normal. Tetap jaga kesehatan dan lakukan skrining rutin.',
        icon: <CheckCircle2 size={64} className="text-green-500" />
    };

    return (
        <div className="min-h-screen bg-hospital-blue-50 flex flex-col p-6">
            <div className={`flex-1 flex flex-col items-center justify-center text-center`}>
                <div className={`p-6 rounded-full ${theme.bg} mb-6 ring-8 ring-white shadow-xl`}>
                    {theme.icon}
                </div>

                <h2 className={`text-2xl font-bold ${theme.color} mb-2`}>{theme.message}</h2>
                <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-hospital-blue-400 border border-hospital-blue-100 mb-6 shadow-sm">
                    CONFIDENCE: 94.2%
                </div>

                <p className="text-hospital-blue-600 leading-relaxed max-w-xs mb-8">
                    {theme.description}
                </p>

                {/* Action Card */}
                {isHighRisk && (
                    <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-red-100 mb-6">
                        <h3 className="font-bold text-left text-hospital-blue-900 mb-3 text-sm">Rekomendasi Tindakan</h3>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-hospital-blue-50 rounded-xl hover:bg-hospital-blue-100 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-hospital-blue-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-hospital-blue-900">Puskesmas Terdekat</p>
                                        <p className="text-xs text-hospital-blue-500">0.8 km dari lokasi anda</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-hospital-blue-600 bg-white px-2 py-1 rounded border border-hospital-blue-200">NAVIGASI</div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 bg-hospital-blue-50 rounded-xl hover:bg-hospital-blue-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                        <Phone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-hospital-blue-900">Konsultasi Dokter</p>
                                        <p className="text-xs text-hospital-blue-500">HaloDoc / Alodokter</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Button onClick={() => navigate('/dashboard')} variant="secondary" className="w-full mb-2">
                <Home className="mr-2" size={20} />
                Kembali ke Beranda
            </Button>
        </div>
    );
};

export default Result;
