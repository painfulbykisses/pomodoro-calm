import { Play, Pause, Moon, Sun, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Circular Progress Component
const ProgressRing = ({ radius, stroke, progress }: any) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: radius * 2, height: radius * 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    stroke="var(--border-color)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="var(--accent-color)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
    );
};

export const FloatingControl = ({ theme, toggleTheme, timeLeft, isActive, toggleTimer, formatTime, progress, mode, setDuration }: any) => {
    const [showDurationPicker, setShowDurationPicker] = useState(false);

    const handleDurationClick = (minutes: number) => {
        if (setDuration) {
            setDuration(minutes);
        }
        setShowDurationPicker(false);
    };

    return (
        <motion.div
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="floating-wrapper"
            style={{
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}
        >
            {/* Duration Picker Popup */}
            <AnimatePresence>
                {showDurationPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -60, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            translateX: '-50%',
                            marginBottom: '10px',
                            background: theme === 'dark' ? 'rgba(39, 39, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(12px)',
                            padding: '8px',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow)',
                            display: 'flex',
                            gap: '8px',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        {[15, 25, 45, 60].map(min => (
                            <button
                                key={min}
                                onClick={() => handleDurationClick(min)}
                                className="btn btn-ghost"
                                style={{ padding: '8px 12px', fontSize: '0.9rem', borderRadius: '8px', minWidth: '40px' }}
                            >
                                {min}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="card floating-control-card" style={{
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: 'var(--shadow-focus)',
                border: '1px solid var(--border-color)',
                backgroundColor: theme === 'dark' ? 'rgba(39, 39, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', // Glassmorphism
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', // Safari support
            }}>
                {/* Timer Display (Clickable) */}
                <div
                    onClick={() => !isActive && setShowDurationPicker(!showDurationPicker)}
                    style={{
                        position: 'relative',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isActive ? 'default' : 'pointer'
                    }}
                >
                    <div style={{ position: 'absolute' }}>
                        <ProgressRing radius={25} stroke={3} progress={progress} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatTime(timeLeft)}
                    </span>
                    {!isActive && !showDurationPicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            style={{ position: 'absolute', top: -10, right: -10, background: 'var(--accent-color)', borderRadius: '50%', padding: '2px' }}
                        >
                            <Clock size={10} color="var(--bg-color)" />
                        </motion.div>
                    )}
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

                <button
                    onClick={toggleTimer}
                    className="btn"
                    style={{
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        background: 'transparent',
                        color: 'var(--text-primary)'
                    }}
                >
                    {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    <span className="floating-start-text" style={{ minWidth: '80px', textAlign: 'left' }}>
                        {isActive ? (mode === 'focus' ? 'FOCUSING' : 'BREAK') : 'START SESSION'}
                    </span>
                </button>

                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost"
                    style={{ padding: '8px', borderRadius: '50%' }}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
        </motion.div>
    );
};
