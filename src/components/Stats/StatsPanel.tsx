import { ArrowUpRight, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { startOfWeek, addDays, format } from 'date-fns';

const WeeklyChart = ({ selectedDate, data }: { selectedDate: Date, data: number[] }) => {
    // Monday = 0, Sunday = 6. 
    // getDay returns 0 for Sunday, 1 for Monday.
    // Adjust to match array (0=Mon, 6=Sun)
    const dayIndex = (selectedDate.getDay() + 6) % 7;

    return (
        <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0', width: '100%' }}>
            {data.map((height, i) => (
                <motion.div
                    key={`${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: `${Math.max(height, 2)}%`, // Min height 2% for visibility
                        opacity: i === dayIndex ? 1 : 0.5,
                        backgroundColor: i === dayIndex ? 'var(--accent-color)' : 'var(--border-color)'
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                        flex: 1,
                        borderRadius: '6px',
                        transformOrigin: 'bottom'
                    }}
                >
                </motion.div>
            ))}
        </div>
    );
};

interface StatsPanelProps {
    selectedDate: Date;
}

export const StatsPanel = ({ selectedDate }: StatsPanelProps) => {
    const { state } = useStore();
    const { user, stats } = state;

    // Calculate Weekly Stats
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekData = Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(weekStart, i);
        const dateKey = format(day, 'yyyy-MM-dd');
        return stats.dailyFocus[dateKey] || 0;
    });

    // Normalize for chart (Goal: 8 hours = 100%)
    // If max value > 8 hours, scale to max.
    const GOAL_SECONDS = 8 * 3600;
    const maxVal = Math.max(...weekData, GOAL_SECONDS);
    const chartData = weekData.map(val => (val / maxVal) * 100);

    // Calculate Today's Stats
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todaySeconds = stats.dailyFocus[todayKey] || 0;
    const todayHours = Math.floor(todaySeconds / 3600);
    const todayMinutes = Math.floor((todaySeconds % 3600) / 60);

    // Convert total seconds to hours and minutes
    const totalHours = Math.floor(stats.totalFocusTime / 3600);
    const totalMinutes = Math.floor((stats.totalFocusTime % 3600) / 60);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', color: 'var(--text-primary)', position: 'relative' }}>

            {/* Theme-aware Glow Accent: Sun (Orange) or Moon (Blue) */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '-30px',
                    width: '140px',
                    height: '140px',
                    background: 'var(--accent-color)', // Uses CSS var which changes with theme
                    filter: 'blur(70px)',
                    zIndex: 0,
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }}
            />

            {/* Header / Profile */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                }}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <UserIcon size={24} color="var(--text-secondary)" />
                    )}
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>{user?.name || 'Guest'}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <span>⏱ {totalHours}h {totalMinutes}min</span>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                    <h3>Weekly Focus</h3>
                    <select style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', outline: 'none' }}>
                        <option>This Week</option>
                    </select>
                </div>
                <WeeklyChart selectedDate={selectedDate} data={chartData} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>TOTAL FOCUS</span>
                        <span style={{ fontSize: '0.75rem', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '2px' }}><ArrowUpRight size={12} /> +1</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.sessionsCompleted}</div>
                </div>
                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                    {/* Placeholder for Avg/Day */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>TODAY</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {todayHours}h {todayMinutes}m
                    </div>
                </div>
            </div>
        </div>
    );
};
