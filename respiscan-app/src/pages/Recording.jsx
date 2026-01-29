import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import AudioVisualizer from '../components/AudioVisualizer';

const Recording = () => {
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5); // 5 seconds recording
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(audioStream);
            setIsRecording(true);
            setError(null);

            setTimeLeft(5);

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        stopRecording(audioStream);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            console.error("Microphone access denied:", err);
            setError("Izin mikrofon diperlukan untuk melakukan skrining. Silakan aktifkan izin di pengaturan browser.");
        }
    };

    const stopRecording = (currentStream) => {
        clearInterval(timerRef.current);
        const s = currentStream || stream;
        if (s) {
            s.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setStream(null);

        // Auto navigate to analysis after recording
        setTimeout(() => {
            navigate('/analysis');
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            clearInterval(timerRef.current);
        };
    }, [stream]);

    return (
        <div className="min-h-screen bg-hospital-blue-50 flex flex-col">
            <div className="p-6">
                <button onClick={() => navigate('/dashboard')} className="text-hospital-blue-600 mb-6 flex items-center">
                    <ArrowLeft size={20} className="mr-1" /> Kembali
                </button>

                <h2 className="text-2xl font-bold text-hospital-blue-900 mb-2">Perekaman Suara</h2>
                <p className="text-hospital-blue-600 text-sm mb-8">
                    Silakan batuk di dekat mikrofon sebanyak 3-5 kali untuk dianalisis.
                </p>

                <div className="bg-white rounded-3xl p-6 shadow-xl border border-hospital-blue-100 flex flex-col items-center justify-center min-h-[400px]">

                    <div className="w-full mb-8">
                        <AudioVisualizer isRecording={isRecording} stream={stream} />
                    </div>

                    {error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-6">
                            <AlertCircle className="shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : (
                        <div className="text-center mb-8">
                            <span className="text-6xl font-bold text-hospital-blue-900 font-mono">
                                00:0{timeLeft}
                            </span>
                            <p className="text-sm text-hospital-blue-400 mt-2 uppercase tracking-widest font-semibold">
                                {isRecording ? 'Merekam...' : 'Siap Merekam'}
                            </p>
                        </div>
                    )}

                    {!isRecording ? (
                        <Button
                            onClick={startRecording}
                            className="w-full py-4 rounded-2xl text-lg group"
                        >
                            <div className="bg-white/20 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform">
                                <Mic className="text-white" size={24} />
                            </div>
                            Mulai Rekam
                        </Button>
                    ) : (
                        <Button
                            onClick={() => stopRecording()}
                            variant="danger"
                            className="w-full py-4 rounded-2xl text-lg animate-pulse"
                        >
                            <Square className="mr-3 fill-current" size={20} />
                            Berhenti
                        </Button>
                    )}

                    <p className="mt-6 text-center text-xs text-hospital-blue-300 max-w-xs">
                        Pastikan lingkungan sekitar tenang untuk hasil analisis yang akurat.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Recording;
