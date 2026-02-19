import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SplitLayoutProps {
    children: [ReactNode, ReactNode];
}

export const SplitLayout = ({ children }: SplitLayoutProps) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    padding: 'var(--spacing-xl)',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {children[0]}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                style={{
                    padding: 'var(--spacing-xl)',
                    backgroundColor: 'transparent', // Using parent bg
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Changed from center to ensure top alignment if needed, but user asked for "center" position generally.
                    // Actually, user said "sejajar" (parallel). If both have similar heights (controlled by max-height), 'center' works well.
                    // Let's keep 'center' but make sure the flex alignment is good.
                    alignItems: 'stretch', // Ensure they don't shrink weirdly
                    position: 'relative'
                }}
            >
                {/* Divider line visual if necessary, but we'll use whitespace for now */}
                {children[1]}
            </motion.div>
        </div>
    );
};
