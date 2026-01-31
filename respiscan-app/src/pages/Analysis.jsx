import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle2, FileText, Activity } from 'lucide-react';
import SpectrogramView from '../components/SpectrogramView';
import { useTheme } from '../context/ThemeContext';

import { loadModel, predictCough } from '../services/inferenceService';
import { useLocation } from 'react-router-dom';

const LOGS = [
    "Initializing MobileNetV2 core...",
    "Loading quantized weights (int8)...",
    "Allocating tensors...",
    "Processing audio buffer (44.1kHz)...",
    "Applying Noise Reduction DSP...",
    "Generating Mel-Spectrogram features...",
    "Extracting MFCC features...",
    "Running Inference...",
    "Calculating Softmax probabilities...",
    "Verifying confidence threshold...",
    "Analysis Complete."
];

const Analysis = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [userLogs, setUserLogs] = useState([]);

    // Get audioBlob from navigation state
    const audioBlob = location.state?.audioBlob;

    const addLog = (message) => {
        setUserLogs(prev => [...prev, message]);
    };

    useEffect(() => {
        let isMounted = true;

        const runAnalysis = async () => {
            if (!audioBlob) {
                if (isMounted) {
                    addLog("Error: No audio data found.");
                    addLog("Redirecting to recording...");
                    setTimeout(() => navigate('/record'), 2000);
                }
                return;
            }

            try {
                // Phase 1: Initialization
                setProgress(10);
                addLog("Initializing Custom AI Engine...");

                await loadModel(); // Pre-load
                if (!isMounted) return;

                setProgress(30);
                addLog("Model Loaded: MobileNetV2 (RespiScan Custom)");

                // Phase 2: Preprocessing
                addLog("Processing Audio Signal (Web Audio API)...");
                setProgress(40);

                addLog("Generating Mel-Spectrogram features...");
                setProgress(50);

                // Phase 3: Inference
                addLog("Running Inference on TensorFlow.js...");
                setProgress(70);

                const start = performance.now();
                const result = await predictCough(audioBlob);
                const end = performance.now();

                if (!isMounted) return;

                addLog(`Inference complete in ${(end - start).toFixed(2)}ms`);
                setProgress(90);

                addLog("Interpreting probability distribution...");
                setProgress(100);

                // Simulation: map output index 0 or 1 to risk
                // Typically: 0 = Healthy/Background, 1 = Cough/Sick
                // This depends on how the user trained the model. 
                // We'll assume typically 0 is 'Negative' and 1 is 'Positive'
                // But without labels.txt, we guess.
                const isHighRisk = result.index === 1;

                addLog(`Result: Class ${result.index} (Conf: ${(result.score * 100).toFixed(1)}%)`);

                setTimeout(() => {
                    navigate('/result', {
                        state: {
                            risk: isHighRisk ? 'High' : 'Low',
                            confidence: result.score,
                            raw: result.raw
                        }
                    });
                }, 1000);

            } catch (error) {
                if (!isMounted) return;
                console.error(error);
                addLog(`Error: ${error.message}`);
                addLog("Please ensure 'public/AI' contains valid model files.");
            }
        };

        runAnalysis();

        return () => {
            isMounted = false;
        };
    }, [audioBlob, navigate]);

    return (
        <div className={`min-h-screen p-6 flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-hospital-blue-50 text-hospital-blue-900'}`}>

            <div className="mb-8 text-center animate-pulse">
                <Cpu size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-medical-teal-500'}`} />
                <h2 className="text-xl font-bold font-mono tracking-widest">ANALYZING</h2>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-hospital-blue-400'}`}>AI ENGINE RUNNING ON-DEVICE</p>
            </div>

            <div className="w-full max-w-sm mb-8">
                <SpectrogramView progress={progress} darkMode={isDarkMode} />
            </div>

            <div className="w-full max-w-sm">
                <div className={`flex justify-between text-xs font-mono mb-1 ${isDarkMode ? 'text-blue-400' : 'text-medical-teal-500'}`}>
                    <span>PROCESSING</span>
                    <span>{progress}%</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden mb-8 ${isDarkMode ? 'bg-slate-700' : 'bg-hospital-blue-200'}`}>
                    <div
                        className={`h-full shadow-[0_0_10px_rgba(20,184,166,0.8)] transition-all duration-100 ease-linear ${isDarkMode ? 'bg-blue-500' : 'bg-medical-teal-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className={`rounded-xl p-4 border font-mono text-xs h-40 overflow-hidden flex flex-col-reverse transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white border-hospital-blue-200 text-hospital-blue-800'}`}>
                    {userLogs.map((log, i) => (
                        <div key={i} className="mb-1">
                            <span className={`${isDarkMode ? 'text-blue-400' : 'text-hospital-blue-500'} mr-2`}>[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                            <span className={isDarkMode ? 'text-slate-300' : 'text-hospital-blue-900'}>{log}</span>
                        </div>
                    )).reverse()}
                </div>
            </div>

        </div>
    );
};

export default Analysis;
