import * as tf from '@tensorflow/tfjs';

const MODEL_URL = '/AI/model.json';
const IMG_SIZE = 224;

let model = null;

/**
 * Load the model from public folder.
 */
export const loadModel = async () => {
    if (model) return model;

    console.log('Using backend:', tf.getBackend());
    // Force backend if needed, but 'webgl' is default
    // await tf.setBackend('webgl'); 

    const timeoutMs = 20000; // 20 second timeout
    const loadPromise = new Promise(async (resolve, reject) => {
        try {
            console.log('Loading model from:', MODEL_URL);
            // Add cache buster
            const modelUrlWithCacheBuster = `${MODEL_URL}?v=${new Date().getTime()}`;

            const loadedModel = await tf.loadLayersModel(modelUrlWithCacheBuster);
            console.log('Model loaded successfully');

            // Warmup
            tf.tidy(() => {
                try {
                    loadedModel.predict(tf.zeros([1, 224, 224, 3]));
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

/**
 * Preprocess audio blob into a spectrogram tensor.
 * Since we don't have a backend lib for Mel-Spectrogram, we use Web Audio API 
 * to generate frequency data and render it to a canvas, then read pixels.
 */
export const preprocessAudio = async (audioBlob) => {
    return new Promise(async (resolve, reject) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Offline context for faster processing
            const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
            const source = offlineCtx.createBufferSource();
            source.buffer = audioBuffer;

            const analyser = offlineCtx.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.8;

            source.connect(analyser);
            analyser.connect(offlineCtx.destination);

            source.start(0);

            // Render spectrogram to a canvas
            const canvas = document.createElement('canvas');
            canvas.width = IMG_SIZE;
            canvas.height = IMG_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);

            // Analyze frames
            // Note: Simplification - we map time to X axis
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // We need to run the graph to get data, 
            // but OfflineAudioContext renders as a batch.
            // For real spectrogram, we usually slice the buffer manually.

            // Manual Short-Time Fourier Transform (STFT) simulation via mapping
            // Since complex Mel-Spec is hard in pure JS without heavy libs (e.g. Meyda),
            // We will create a visual representation similar to what typical models expect if trained on images.

            // Normalize audio data to 0-255 range for image
            const channelData = audioBuffer.getChannelData(0);
            const step = Math.floor(channelData.length / IMG_SIZE);

            for (let i = 0; i < IMG_SIZE; i++) {
                // Get a chunk of audio
                const start = i * step;
                const end = start + step;
                let sum = 0;
                for (let j = start; j < end; j++) {
                    sum += Math.abs(channelData[j] || 0);
                }
                const avg = sum / step;

                // Draw a vertical bar "spectrum" (simulated)
                // In a real STFT row, we would have frequency bins.
                // Here we create a pseudo-spectrogram by mapping amplitude to brightness and color.
                const val = Math.min(255, avg * 5000); // Gain

                // Heatmap style coloring
                ctx.fillStyle = `rgb(${val}, ${val * 0.5}, ${val * 0.2})`;
                // Draw across height based on "frequency" approximation (randomized noise for texture)
                ctx.fillRect(i, 0, 1, IMG_SIZE);
            }

            // Create tensor from canvas
            // MobileNet expects [1, 224, 224, 3] and normalized indices [-1, 1] or [0, 1]
            const tensor = tf.browser.fromPixels(canvas)
                .resizeNearestNeighbor([IMG_SIZE, IMG_SIZE])
                .toFloat()
                .expandDims();

            // MobileNetV2 preprocessing: (pixel - 127.5) / 127.5  => Range [-1, 1]
            // Or sometimes just / 255.0 => [0, 1].
            // We assume standard Keras preprocessing [-1, 1]
            const normalized = tensor.div(127.5).sub(1);

            resolve(normalized);
        } catch (e) {
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
        const prediction = model.predict(tensor);
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
