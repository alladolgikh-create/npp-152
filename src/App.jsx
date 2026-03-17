import { useState, useMemo } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionBlock from './components/QuestionBlock';
import ProgressBar from './components/ProgressBar';
import Results from './components/Results';

const STATES = {
  WELCOME: 'welcome',
  QUESTIONNAIRE: 'questionnaire',
  LOADING: 'loading',
  RESULTS: 'results',
};

const totalQuestions = 152;
const totalBlocks = 4;

function App() {
  const [appState, setAppState] = useState(STATES.WELCOME);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [answers, setAnswers] = useState({});
  const [answerIndices, setAnswerIndices] = useState({});
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState('');

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const handleStart = (name) => {
    setUserName(name);
    setAppState(STATES.QUESTIONNAIRE);
    setCurrentBlock(1);
    setAnswers({});
    setAnswerIndices({});
  };

  const handleAnswer = (questionId, value, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setAnswerIndices((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleBlockComplete = async () => {
    if (currentBlock < totalBlocks) {
      setCurrentBlock((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAppState(STATES.LOADING);

      try {
        const response = await fetch('https://api.crazymethod.pro/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, userName }),
        });

        const data = await response.json();
        console.log('API response:', data);

        if (data.success) {
          setResults(data.results);
          setAppState(STATES.RESULTS);
        } else {
          console.error('API error response:', data);
          alert(`Ошибка при обработке результатов: ${data.error || 'неизвестная ошибка'}. Попробуйте еще раз.`);
          setAppState(STATES.QUESTIONNAIRE);
        }
      } catch (error) {
        console.error('API error:', error);
        alert('Ошибка соединения с сервером. Проверьте интернет и попробуйте еще раз.');
        setAppState(STATES.QUESTIONNAIRE);
      }

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
    setAnswerIndices({});
    setResults(null);
    setUserName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a0a0a' }}>
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
              answerIndices={answerIndices}
              onAnswer={handleAnswer}
              onBlockComplete={handleBlockComplete}
              onPreviousBlock={handlePreviousBlock}
            />
          </>
        )}

        {appState === STATES.LOADING && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: '#ff00ff33', borderTopColor: '#ff00ff' }}></div>
            <p className="text-lg" style={{ color: '#888888', fontFamily: 'var(--font-mono)' }}>Анализируем ваш нейрохимический профиль...</p>
          </div>
        )}

        {appState === STATES.RESULTS && results && (
          <Results results={results} userName={userName} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}

export default App;
