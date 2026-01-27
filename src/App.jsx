import { useState, useMemo } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionBlock from './components/QuestionBlock';
import ProgressBar from './components/ProgressBar';
import Results from './components/Results';
import {
  calculateNeurotransmitterScales,
  getTotalQuestions,
  getTotalBlocks,
} from './utils/scoring';

const STATES = {
  WELCOME: 'welcome',
  QUESTIONNAIRE: 'questionnaire',
  RESULTS: 'results',
};

function App() {
  const [appState, setAppState] = useState(STATES.WELCOME);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState('');

  const totalQuestions = getTotalQuestions();
  const totalBlocks = getTotalBlocks();

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const handleStart = (name) => {
    setUserName(name);
    setAppState(STATES.QUESTIONNAIRE);
    setCurrentBlock(1);
    setAnswers({});
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleBlockComplete = () => {
    if (currentBlock < totalBlocks) {
      setCurrentBlock((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const calculatedResults = calculateNeurotransmitterScales(answers);
      setResults(calculatedResults);
      setAppState(STATES.RESULTS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlock > 1) {
      setCurrentBlock((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setAppState(STATES.WELCOME);
    setCurrentBlock(1);
    setAnswers({});
    setResults(null);
    setUserName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-fuchsia-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {appState === STATES.WELCOME && <WelcomeScreen onStart={handleStart} />}

        {appState === STATES.QUESTIONNAIRE && (
          <>
            <ProgressBar
              current={answeredCount}
              total={totalQuestions}
              currentBlock={currentBlock}
              totalBlocks={totalBlocks}
            />
            <QuestionBlock
              blockId={currentBlock}
              answers={answers}
              onAnswer={handleAnswer}
              onBlockComplete={handleBlockComplete}
              onPreviousBlock={handlePreviousBlock}
            />
          </>
        )}

        {appState === STATES.RESULTS && results && (
          <Results results={results} userName={userName} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}

export default App;
