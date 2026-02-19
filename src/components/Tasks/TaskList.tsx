import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Plus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';

interface TaskListProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

export const TaskList = ({ selectedDate, setSelectedDate }: TaskListProps) => {
    const { state, dispatch } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [priority, setPriority] = useState('Low');
    const [category, setCategory] = useState('Work');

    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            dispatch({
                type: 'ADD_TASK',
                payload: {
                    id: Date.now(),
                    title: newTaskTitle,
                    time: format(new Date(), 'HH:mm'),
                    duration: '25m',
                    completed: false,
                    createdAt: selectedDate.getTime(),
                    tags: [priority, category]
                }
            });
            setNewTaskTitle('');
            setIsAdding(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Calendar Strip (Reference Style) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <button className="btn btn-ghost" onClick={() => setSelectedDate(subDays(selectedDate, 7))}>
                    <ChevronLeft size={20} color="var(--text-secondary)" />
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {weekDays.map((date, i) => {
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                style={{
                                    width: '56px', // Reference size approx
                                    height: '68px',
                                    borderRadius: '18px', // High rounded corners
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // Selected: Surface color (White/DarkGrey) + Shadow. Unselected: Transparent.
                                    background: isSelected ? 'var(--surface-color)' : 'transparent',
                                    boxShadow: isSelected ? 'var(--shadow)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    // Scale effect slightly
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    marginBottom: isSelected ? '0px' : '0px'
                                }}
                            >
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', // Black/White when selected
                                    marginBottom: '2px',
                                    textTransform: 'uppercase',
                                    opacity: isSelected ? 1 : 0.7
                                }}>
                                    {format(date, 'EEE')}
                                </span>
                                <span style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    opacity: isSelected ? 1 : 0.5
                                }}>
                                    {format(date, 'dd')}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <button className="btn btn-ghost" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
                    <ChevronRight size={20} color="var(--text-secondary)" />
                </button>
            </div>

            {/* Task List Container */}
            <motion.div
                layout
                className="card"
                style={{
                    backgroundColor: 'var(--surface-color)',
                    borderRadius: '24px', // More rounded
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    minHeight: '300px', // Min height for look
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {format(selectedDate, 'EEEE, d MMMM yyyy')}
                    </h2>
                    <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem' }}>
                        <Plus size={18} /> Add Task
                    </button>
                </div>

                {/* Add Input */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    className="input"
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    // Remove onKeyDown submit to allow selecting options first usually, but keeping Enter for speed is nice.
                                    // onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-color)',
                                        color: 'var(--text-primary)',
                                        outline: 'none'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-color)',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Low">Low Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="High">High Priority</option>
                                    </select>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-color)',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Work">Work</option>
                                        <option value="Study">Study</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                    <button onClick={handleAddTask} className="btn btn-primary" style={{ marginLeft: 'auto', borderRadius: '12px', padding: '8px 24px' }}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <AnimatePresence mode="popLayout">
                        {state.tasks
                            .filter(task => isSameDay(new Date(task.createdAt), selectedDate))
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    {...task}
                                    dispatch={dispatch}
                                />
                            ))}

                        {state.tasks.filter(task => isSameDay(new Date(task.createdAt), selectedDate)).length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                            >
                                No tasks for today.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const TaskItem = ({ id, title, time, duration, completed, tags, active, dispatch }: any) => {
    // Reference style: "Card inside Card" look
    // Or just clean dividers? The image shows cards.

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                backgroundColor: 'var(--bg-color)', // Card slightly distinct from container
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                gap: '16px',
                position: 'relative',
                cursor: 'pointer'
            }}
            onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: id })}
        >
            {/* Left Icon */}
            <div style={{ paddingTop: '4px' }}>
                {completed ? (
                    <CheckCircle2 size={24} color="#10b981" fill="#10b981" className="text-white" />
                ) : (
                    active ? (
                        <div style={{
                            width: '24px', height: '24px',
                            borderRadius: '50%',
                            border: '2px solid var(--accent-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                        </div>
                    ) : (
                        <Clock size={24} color="var(--text-secondary)" />
                    )
                )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                        textDecoration: completed ? 'line-through' : 'none'
                    }}>
                        {title}
                    </span>

                    {/* Right side: Duration & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {duration}
                        </span>
                        <button
                            className="btn btn-ghost"
                            style={{ padding: '6px', color: '#ef4444' }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent toggling task
                                dispatch({ type: 'DELETE_TASK', payload: id });
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Sub-info: Time Range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {time} <ArrowRight size={12} /> {addMinutes(time, 25)}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {tags.map((tag: string, i: number) => (
                            <span key={i} style={{
                                fontSize: '0.75rem',
                                padding: '4px 12px',
                                borderRadius: '10px',
                                background: getTagColor(tag).bg,
                                color: getTagColor(tag).text,
                                fontWeight: 600
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Helper for mock time calculation
const addMinutes = (timeStr: string, minutes: number) => {
    // Very simple mock parser/adder
    try {
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m + minutes);
        return format(date, 'HH:mm');
    } catch (e) {
        return timeStr;
    }
};

const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
        case 'low': return { bg: '#bbf7d0', text: '#15803d' }; // Green
        case 'medium': return { bg: '#fed7aa', text: '#c2410c' }; // Orange
        case 'high': return { bg: '#fecaca', text: '#b91c1c' }; // Red
        case 'work': return { bg: '#e0f2fe', text: '#0369a1' }; // Blue
        case 'study': return { bg: '#e9d5ff', text: '#7e22ce' }; // Purple
        case 'personal': return { bg: '#fce7f3', text: '#be185d' }; // Pink
        case 'in progress': return { bg: '#e9d5ff', text: '#7e22ce' }; // Purple
        default: return { bg: 'var(--border-color)', text: 'var(--text-secondary)' };
    }
};
