import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import Questionnaire from '@/components/Questionnaire';
import TreeEditor from '@/components/TreeEditor';

export default function Home() {
  const [step, setStep] = useState('start');
  const [projectData, setProjectData] = useState(null);

  const handleStart = () => setStep('questionnaire');

  const handleComplete = answers => {
    setProjectData(answers);
    setStep('editor');
  };

  const handleReset = () => {
    setProjectData(null);
    setStep('start');
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-200">
      {step === 'start' && <StartScreen onStart={handleStart} />}
      {step === 'questionnaire' && (
        <Questionnaire onComplete={handleComplete} onBack={handleReset} />
      )}
      {step === 'editor' && <TreeEditor projectData={projectData} onReset={handleReset} />}
    </div>
  );
}