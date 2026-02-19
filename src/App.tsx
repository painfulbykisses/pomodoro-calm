import { useEffect, useState } from 'react';
import { SplitLayout } from './components/Layout/SplitLayout';
import { TopBar } from './components/Layout/TopBar';
import { StatsPanel } from './components/Stats/StatsPanel';
import { TaskList } from './components/Tasks/TaskList';
import { FloatingControl } from './components/Timer/FloatingControl';
import { useTimer } from './hooks/useTimer';
import { StoreProvider, useStore } from './context/StoreContext';
import { LoginScreen } from './components/Auth/LoginScreen';

import { Background } from './components/Layout/Background';

const MainApp = () => {
  const { state, dispatch } = useStore();
  const { timeLeft, isActive, toggleTimer, formatTime, progress, mode, setDuration } = useTimer();

  /* Shared State for Date Selection */
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Apply theme to body
    document.body.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light'
    });
  };

  if (!state.user) {
    return <LoginScreen />;
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      // Background handled by Background component
      color: 'var(--text-primary)',
      transition: 'color 0.4s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Background theme={state.theme} />
      <TopBar />
      <SplitLayout>
        <div className="left-panel">
          <StatsPanel selectedDate={selectedDate} />
        </div>
        <div className="right-panel">
          <TaskList selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      </SplitLayout>


      {/* Floating Timer Control & Theme Toggle */}
      <FloatingControl
        theme={state.theme}
        toggleTheme={toggleTheme}
        timeLeft={timeLeft}
        isActive={isActive}
        toggleTimer={toggleTimer}
        formatTime={formatTime}
        progress={progress}
        mode={mode}
        setDuration={setDuration}
      />
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
