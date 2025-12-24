import React, { useRef, useEffect } from 'react';
import './Noise.css';

interface NoiseProps {
    patternSize?: number;
    patternScaleX?: number;
    patternScaleY?: number;
    patternRefreshInterval?: number;
    patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
    patternSize = 250,
    patternScaleX = 1,
    patternScaleY = 1,
    patternRefreshInterval = 2,
    patternAlpha = 15
}) => {
    const grainRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = grainRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let frame = 0;
        let animationId: number;
        const canvasSize = 1024; // Fixed size for pattern calculation

        const resize = () => {
            // Create a temporary canvas to hold the pattern could be an optimization, 
            // but here we just resize the display canvas.
            // The drawing logic below constantly redraws pixels to the whole canvas? 
            // Wait, the provided code draws to 'imageData' of size 'canvasSize' then puts it at 0,0.
            // If the canvas is resized to window size, putting image data at 0,0 only covers top left if window > 1024.
            // However, the provided code sets width/height to canvasSize (1024) inside resize()?
            // No, wait: 
            // canvas.width = canvasSize; 
            // canvas.height = canvasSize;
            // canvas.style.width = '100vw'; 
            // ...
            // So the canvas internal resolution is 1024x1024, stretched to cover viewport.
            // This matches the provided snippet behavior.

            if (!canvas) return;
            canvas.width = canvasSize;
            canvas.height = canvasSize;

            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
        };

        const drawGrain = () => {
            const imageData = ctx.createImageData(canvasSize, canvasSize);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = patternAlpha;
            }

            ctx.putImageData(imageData, 0, 0);
        };

        const loop = () => {
            if (frame % patternRefreshInterval === 0) {
                drawGrain();
            }
            frame++;
            animationId = window.requestAnimationFrame(loop);
        };

        window.addEventListener('resize', resize);
        resize();
        loop();

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(animationId);
        };
    }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

    return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: 'pixelated' }} />;
};

export default Noise;
