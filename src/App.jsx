import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import Questionnaire from '@/components/Questionnaire';
import TreeEditor from '@/components/TreeEditor';

export default function App() {
  const [stage, setStage] = useState('start');
  const [projectData, setProjectData] = useState(null);

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      {stage === 'start' && <StartScreen onStart={() => setStage('quiz')} />}
      {stage === 'quiz' && (
        <Questionnaire onBack={() => setStage('start')} onComplete={data => { setProjectData(data); setStage('editor'); }} />
      )}
      {stage === 'editor' && projectData && (
        <TreeEditor projectData={projectData} onReset={() => { setProjectData(null); setStage('start'); }} />
      )}
    </div>
  );
}
