import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateResult } from './Algorithm';
import LetterGlitch from './LetterGlitch';
import Noise from './Noise';
import GlitchText from './GlitchText';
import FuzzyText from './FuzzyText';


function App() {
    const [step, setStep] = useState(0); // 0: I1, 1: I2, 2: I3, 3: Result
    const [i1, setI1] = useState<string>('');
    const [i2, setI2] = useState<string>('');
    const [i3, setI3] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [step]);

    useEffect(() => {
        if (result && !loading) {
            navigator.clipboard.writeText(result).catch(err => {
                console.error("Failed to copy to clipboard", err);
            });
        }
    }, [result, loading]);

    const handleNext = () => {
        if (step === 0 && !i1) return;
        if (step === 1 && !i2) return;

        if (step === 2) {
            if (!i3) return;
            handleCalculate();
        } else {
            setStep(s => s + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNext();
        }
    };

    const handleCalculate = () => {
        setLoading(true);
        setStep(3);

        setTimeout(() => {
            try {
                const intI1 = parseInt(i1, 10);
                if (isNaN(intI1)) {
                    setResult("ERROR: FIRST OFFERING MUST BE NUMERIC");
                    setLoading(false);
                    return;
                }

                const res = calculateResult(intI1, i2, i3);
                setResult(res);
            } catch (e) {
                setResult("THE RITUAL FAILED");
                console.error(e);
            }
            setLoading(false);
        }, 2500);
    };

    const reset = () => {
        setStep(0);
        setI1('');
        setI2('');
        setI3('');
        setResult(null);
    };

    const promptStyle = {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '1.5rem',
        color: '#ffffff',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        zIndex: 10,
        pointerEvents: 'none' as const
    };

    const invisibleInputStyle = {
        position: 'absolute' as const,
        opacity: 0,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        cursor: 'none',
        caretColor: 'transparent'
    };

    return (
        <div className="main-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', cursor: 'none' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <LetterGlitch
                    glitchSpeed={2}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                <Noise
                    patternSize={250}
                    patternScaleX={1}
                    patternScaleY={1}
                    patternRefreshInterval={2}
                    patternAlpha={15}
                />
            </div>

            <div className="container center-stage" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '800px' }}>
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', height: '100px' }}>
                                <div style={{ position: 'absolute', zIndex: 1, opacity: 0.8 }}>
                                    <GlitchText speed={0.2} enableShadows={true}>WHAT IS YOUR DEED?</GlitchText>
                                </div>
                                <div style={{ position: 'absolute', zIndex: 2, opacity: 0.8, pointerEvents: 'none' }}>
                                    <FuzzyText fontSize="clamp(2rem, 5vw, 4rem)" fontFamily="'MatterOfFact', monospace" color="#fff" enableHover={false} baseIntensity={0.2}>WHAT IS YOUR DEED?</FuzzyText>
                                </div>
                            </div>
                            <input
                                ref={inputRef}
                                type="number"
                                value={i1}
                                onChange={(e) => setI1(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={invisibleInputStyle}
                                autoFocus
                            />
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', height: '100px' }}>
                                <div style={{ position: 'absolute', zIndex: 1, opacity: 0.8 }}>
                                    <GlitchText speed={0.2} enableShadows={true}>WHAT DO YOU DESIRE?</GlitchText>
                                </div>
                                <div style={{ position: 'absolute', zIndex: 2, opacity: 0.8, pointerEvents: 'none' }}>
                                    <FuzzyText fontSize="clamp(2rem, 5vw, 4rem)" fontFamily="'MatterOfFact', monospace" color="#fff" enableHover={false} baseIntensity={0.2}>WHAT DO YOU DESIRE?</FuzzyText>
                                </div>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={i2}
                                onChange={(e) => setI2(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={invisibleInputStyle}
                                autoFocus
                            />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', height: '100px' }}>
                                <div style={{ position: 'absolute', zIndex: 1, opacity: 0.8 }}>
                                    <GlitchText speed={0.2} enableShadows={true}>WHAT DO YOU DESIRE OF?</GlitchText>
                                </div>
                                <div style={{ position: 'absolute', zIndex: 2, opacity: 0.8, pointerEvents: 'none' }}>
                                    <FuzzyText fontSize="clamp(2rem, 5vw, 4rem)" fontFamily="'MatterOfFact', monospace" color="#fff" enableHover={false} baseIntensity={0.2}>WHAT DO YOU DESIRE OF?</FuzzyText>
                                </div>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={i3}
                                onChange={(e) => setI3(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={invisibleInputStyle}
                                autoFocus
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {loading ? (
                                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', height: '100px' }}>
                                    <div style={{ position: 'absolute', zIndex: 1, opacity: 0.8 }}>
                                        <GlitchText speed={0.2} enableShadows={true} className="loading-glitch">COMMUNING...</GlitchText>
                                    </div>
                                    <div style={{ position: 'absolute', zIndex: 2, opacity: 0.8, pointerEvents: 'none' }}>
                                        <FuzzyText fontSize="clamp(2rem, 5vw, 4rem)" fontFamily="'MatterOfFact', monospace" color="#fff" enableHover={false} baseIntensity={0.2}>COMMUNING...</FuzzyText>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={reset} style={{ cursor: 'pointer' }}>
                                    <div style={{ ...promptStyle, color: '#ff0000' }}>(leave immediately)</div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default App
