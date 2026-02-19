import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60;   // 5 minutes in seconds

export const useTimer = () => {
    const { dispatch } = useStore();
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [totalDuration, setTotalDuration] = useState(FOCUS_TIME);

    useEffect(() => {
        let interval: any = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            setIsActive(false);
            // Optionally auto-switch mode or play sound here
            if (mode === 'focus') {
                // Record the session
                dispatch({ type: 'RECORD_SESSION', payload: { duration: totalDuration } });

                setMode('break');
                setTimeLeft(BREAK_TIME);
                setTotalDuration(BREAK_TIME);
            } else {
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
                setTotalDuration(FOCUS_TIME);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, dispatch, totalDuration]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        const time = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
        setTimeLeft(time);
        setTotalDuration(time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate progress for helpful UI circel
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

    const setDuration = (minutes: number) => {
        setIsActive(false);
        setMode('focus');
        const newTime = minutes * 60;
        setTimeLeft(newTime);
        setTotalDuration(newTime);
    };

    return {
        timeLeft,
        isActive,
        mode,
        toggleTimer,
        resetTimer,
        setDuration, // Exported
        formatTime,
        progress
    };
};
