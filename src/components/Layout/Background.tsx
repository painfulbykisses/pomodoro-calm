import { motion } from 'framer-motion';

interface BackgroundProps {
    theme: 'light' | 'dark';
}

export const Background = ({ theme }: BackgroundProps) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none'
        }}>
            {/* Dark Mode Background (Moon - Adjusted to Orange Glow as requested) */}
            <motion.div
                initial={false}
                animate={{ opacity: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#121212', // Neutral Dark (almost black)
                    backgroundImage: `
                        radial-gradient(circle at 50% -10%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.08) 0%, transparent 30%)
                    `
                }}
            />

            {/* Light Mode Background (Sun - White with Orange Accent) */}
            <motion.div
                initial={false}
                animate={{ opacity: theme === 'light' ? 1 : 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#ffffff', // Pure White
                    backgroundImage: `
                        radial-gradient(circle at 70% -20%, rgba(255, 140, 0, 0.4) 0%, transparent 60%),
                        radial-gradient(circle at 90% 10%, rgba(255, 165, 0, 0.2) 0%, transparent 40%)
                    `
                }}
            />
        </div>
    );
};
