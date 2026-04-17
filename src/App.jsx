import { useState } from 'react';
import Intake from './intake/Intake.jsx';
import Preview from './components/Preview.jsx';
import WindmarSun from './components/WindmarSun.jsx';

export default function App() {
  const [phase, setPhase] = useState('intake');
  const [intake, setIntake] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <WindmarSun size={38} color="var(--wh-orange)" />
          <div className="brand-name">SalesArt · WindMar Home</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--wh-grey)' }}>MVP v0.1</div>
      </header>

      <main className="app-main">
        {phase === 'intake' && (
          <Intake onComplete={(s) => { setIntake(s); setPhase('preview'); }} />
        )}
        {phase === 'preview' && intake && (
          <Preview intake={intake} onRestart={() => { setIntake(null); setPhase('intake'); }} />
        )}
      </main>
    </div>
  );
}
