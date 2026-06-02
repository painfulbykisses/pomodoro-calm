import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SplitLayoutProps {
    children: [ReactNode, ReactNode];
}

export const SplitLayout = ({ children }: SplitLayoutProps) => {
    return (
        <div className="split-layout">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="split-panel split-panel-left"
            >
                {children[0]}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                className="split-panel split-panel-right"
            >
                {/* Divider line visual if necessary, but we'll use whitespace for now */}
                {children[1]}
            </motion.div>
        </div>
    );
};
