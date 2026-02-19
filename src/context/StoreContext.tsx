import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

// Types
export interface User {
    name: string;
    avatar: string | null; // Data URL
}

export interface Task {
    id: number;
    title: string;
    time: string;       // Display time e.g., "14:00"
    duration: string;   // Display duration e.g., "25m"
    completed: boolean;
    createdAt: number;
    tags?: string[];
    active?: boolean;
}

export interface Stats {
    totalFocusTime: number; // in seconds
    sessionsCompleted: number;
    dailyFocus: { [date: string]: number }; // "YYYY-MM-DD": seconds
}

interface AppState {
    user: User | null;
    tasks: Task[];
    stats: Stats;
    theme: 'light' | 'dark';
}

// Actions
type Action =
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'TOGGLE_TASK'; payload: number }
    | { type: 'DELETE_TASK'; payload: number }
    | { type: 'SET_THEME'; payload: 'light' | 'dark' }
    | { type: 'RECORD_SESSION'; payload: { duration: number } };

// Initial State
const initialState: AppState = {
    user: null,
    tasks: [],
    stats: { totalFocusTime: 0, sessionsCompleted: 0, dailyFocus: {} },
    theme: 'light',
};

// Reducer
const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'ADD_TASK':
            return { ...state, tasks: [action.payload, ...state.tasks] };
        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === action.payload ? { ...t, completed: !t.completed, active: false } : t
                )
            };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'RECORD_SESSION': {
            const today = new Date().toISOString().split('T')[0];
            const currentDaily = state.stats.dailyFocus[today] || 0;
            return {
                ...state,
                stats: {
                    ...state.stats,
                    totalFocusTime: state.stats.totalFocusTime + action.payload.duration,
                    sessionsCompleted: state.stats.sessionsCompleted + 1,
                    dailyFocus: {
                        ...state.stats.dailyFocus,
                        [today]: currentDaily + action.payload.duration
                    }
                }
            };
        }
        default:
            return state;
    }
};

// Context
const StoreContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Provider
export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState, () => {
        // Safe access to localStorage
        try {
            const localData = localStorage.getItem('pomodoro-store');
            return localData ? JSON.parse(localData) : initialState;
        } catch (e) {
            console.error("Failed to load state", e);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('pomodoro-store', JSON.stringify(state));
            document.body.setAttribute('data-theme', state.theme);
        } catch (e) {
            console.error("Failed to save state", e);
        }
    }, [state]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

// Hook
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
