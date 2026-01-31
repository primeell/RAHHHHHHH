import * as tf from '@tensorflow/tfjs';

const MODEL_URL = '/AI/model.json';
const IMG_SIZE = 224;

let model = null;

/**
 * Load the model from public folder.
 */
const timeoutMs = 20000; // 20 second timeout

export const loadModel = async () => {
    if (model) return model;

    console.log('Using backend:', tf.getBackend());

    const loadPromise = new Promise(async (resolve, reject) => {
        try {
            console.log('Loading model from:', MODEL_URL);
            const modelUrlWithCacheBuster = `${MODEL_URL}?v=${new Date().getTime()}`;

            let loadedModel;
            try {
                // Try loading as Layers Model (Keras) first
                console.log('Attempting to load as LayersModel...');
                loadedModel = await tf.loadLayersModel(modelUrlWithCacheBuster, {
                    onProgress: (fraction) => {
                        console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
                    }
                });
                console.log('Successfully loaded as LayersModel');
            } catch (layerError) {
                console.warn('Failed to load as LayersModel:', layerError.message);
                console.log('Attempting to load as GraphModel...');

                // Fallback: Try loading as Graph Model (SavedModel/TFHub)
                try {
                    loadedModel = await tf.loadGraphModel(modelUrlWithCacheBuster);
                    console.log('Successfully loaded as GraphModel');
                } catch (graphError) {
                    console.error('Failed to load as GraphModel:', graphError.message);
                    throw new Error(`Model load failed. Layers: ${layerError.message} | Graph: ${graphError.message}`);
                }
            }

            // Warmup
            tf.tidy(() => {
                try {
                    const zeroTensor = tf.zeros([1, IMG_SIZE, IMG_SIZE, 3]);
                    // Check if predict method exists (Layers) or execute (Graph)
                    if (loadedModel.predict) {
                        loadedModel.predict(zeroTensor);
                    } else if (loadedModel.execute) {
                        loadedModel.execute(zeroTensor);
                    }
                    console.log('Warmup successful');
                } catch (e) {
                    console.warn('Warmup prediction failed (non-fatal):', e);
                }
            });
            resolve(loadedModel);
        } catch (error) {
            console.error('Core load error:', error);
            reject(error);
        }
    });

    try {
        model = await Promise.race([
            loadPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Model load timed out check network/files')), timeoutMs))
        ]);
        return model;
    } catch (error) {
        console.error('Failed to load model:', error);
        throw error;
    }
};

// Simple FFT implementation (Radix-2 Cooley-Tukey)
const fft = (inputReal, inputImag) => {
    const n = inputReal.length;
    if (n <= 1) return;
    const half = n / 2;
    const evenReal = new Float32Array(half);
    const evenImag = new Float32Array(half);
    const oddReal = new Float32Array(half);
    const oddImag = new Float32Array(half);
    for (let i = 0; i < half; i++) {
        evenReal[i] = inputReal[2 * i];
        evenImag[i] = inputImag[2 * i];
        oddReal[i] = inputReal[2 * i + 1];
        oddImag[i] = inputImag[2 * i + 1];
    }
    fft(evenReal, evenImag);
    fft(oddReal, oddImag);
    for (let k = 0; k < half; k++) {
        const theta = -2 * Math.PI * k / n;
        const wr = Math.cos(theta);
        const wi = Math.sin(theta);
        const tReal = wr * oddReal[k] - wi * oddImag[k];
        const tImag = wi * oddReal[k] + wr * oddImag[k];
        inputReal[k] = evenReal[k] + tReal;
        inputImag[k] = evenImag[k] + tImag;
        inputReal[k + half] = evenReal[k] - tReal;
        inputImag[k + half] = evenImag[k] - tImag;
    }
};

export const preprocessAudio = async (audioBlob) => {
    return new Promise(async (resolve, reject) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Get raw PCM data
            const channelData = audioBuffer.getChannelData(0);
            const duration = audioBuffer.duration;
            const sampleRate = audioBuffer.sampleRate;

            // Parameters matched to original logic
            const fftSize = 1024;
            const freqBinCount = fftSize / 2;
            const steps = IMG_SIZE; // 224
            const stepTime = duration / steps;
            const stepSamples = Math.floor(stepTime * sampleRate);

            // Prepare Canvas
            const canvas = document.createElement('canvas');
            canvas.width = IMG_SIZE;
            canvas.height = IMG_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'black'; // Background
            ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);

            // Reusable buffers
            const real = new Float32Array(fftSize);
            const imag = new Float32Array(fftSize);
            const windowTable = new Float32Array(fftSize);

            // Hanning window
            for (let i = 0; i < fftSize; i++) {
                windowTable[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));
            }

            // Generate Spectrogram Column by Column
            for (let i = 0; i < steps; i++) {
                // Calculate start sample for this time step
                // Original used: t = max(0, i * stepTime)
                const startSample = Math.floor(i * stepSamples);

                // Clear buffers
                real.fill(0);
                imag.fill(0);

                // Copy & Window
                for (let j = 0; j < fftSize; j++) {
                    const idx = startSample + j;
                    if (idx < channelData.length) {
                        real[j] = channelData[idx] * windowTable[j];
                    }
                }

                // Compute FFT
                fft(real, imag);

                // Compute Magnitude & Map to Color
                // y goes 0..223. Original logic: 0 is top (high freq?), 223 is bottom.
                // Original map: binIdx = ((IMG_SIZE - 1 - y) / IMG_SIZE) * freqData.length

                for (let y = 0; y < IMG_SIZE; y++) {
                    const binIdx = Math.floor(((IMG_SIZE - 1 - y) / IMG_SIZE) * freqBinCount);
                    // Valid bin?
                    if (binIdx < 0 || binIdx >= freqBinCount) continue;

                    const rVal = real[binIdx];
                    const iVal = imag[binIdx];
                    const mag = Math.sqrt(rVal * rVal + iVal * iVal);

                    // Convert to dB: 20 * log10(mag)
                    // AnalyserNode typically maps [-100dB, -30dB] to [0, 255]
                    // We need to approximate this normalization.
                    // epsilon to avoid log(0)
                    const db = 20 * Math.log10(mag + 1e-6);

                    // Normalize -100 to -30 -> 0 to 255
                    const minDb = -100;
                    const maxDb = -30;
                    let val = (db - minDb) / (maxDb - minDb) * 255;
                    val = Math.max(0, Math.min(255, val));

                    // Heatmap Color Map
                    const r = val;
                    const g = val > 128 ? (val - 128) * 2 : 0;
                    const b = val > 200 ? (val - 200) * 5 : val * 0.5;

                    ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                    ctx.fillRect(i, y, 1, 1);
                }
            }

            // Create tensor
            const tensor = tf.browser.fromPixels(canvas)
                .resizeNearestNeighbor([IMG_SIZE, IMG_SIZE])
                .toFloat()
                .expandDims();

            const normalized = tensor.div(127.5).sub(1);
            resolve(normalized);

        } catch (e) {
            console.error("Spectrogram generation failed:", e);
            reject(e);
        }
    });
};

/**
 * Run inference
 */
export const predictCough = async (audioBlob) => {
    try {
        const model = await loadModel();
        const tensor = await preprocessAudio(audioBlob);

        console.log('Running inference...');

        // Handle both GraphModel (execute) and LayersModel (predict)
        let prediction;
        if (model.predict) {
            prediction = model.predict(tensor);
        } else if (model.execute) {
            prediction = model.execute(tensor);
            // GraphModel might return array or map, handle it
            if (Array.isArray(prediction)) prediction = prediction[0];
        } else {
            throw new Error("Unknown model type: no predict or execute method");
        }

        const data = await prediction.data();

        console.log('Raw output:', data);

        // Cleanup tensors
        tensor.dispose();
        prediction.dispose();

        // interpret result
        // Assuming binary classification [Non-Cough, Cough] or [Healthy, Unhealthy]
        // If softmax: returns probabilities.

        // Find max index
        let maxScore = -1;
        let maxIndex = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > maxScore) {
                maxScore = data[i];
                maxIndex = i;
            }
        }

        return {
            index: maxIndex,
            score: maxScore,
            raw: Array.from(data)
        };
    } catch (error) {
        console.error('Inference failed:', error);
        throw error;
    }
};
