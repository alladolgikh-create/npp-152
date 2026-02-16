import { useState, useEffect } from 'react';
import Question from './Question';
import { getQuestionsByBlock, getBlockInfo } from '../utils/scoring';

const blockColors = {
  1: { gradient: 'linear-gradient(to right, #ff00ff, #d946ef)', accent: '#ff00ff', light: '#fff0fa' },
  2: { gradient: 'linear-gradient(to right, #d946ef, #a855f7)', accent: '#d946ef', light: '#faf5ff' },
  3: { gradient: 'linear-gradient(to right, #ff00aa, #ff00ff)', accent: '#ff00aa', light: '#fff0f5' },
  4: { gradient: 'linear-gradient(to right, #00d4a8, #00b894)', accent: '#00d4a8', light: '#f0fdfa' },
};

export default function QuestionBlock({
  blockId,
  answers,
  answerIndices,
  onAnswer,
  onBlockComplete,
  onPreviousBlock,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const block = getBlockInfo(blockId);
  const questions = getQuestionsByBlock(blockId);
  const colors = blockColors[blockId];

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.every((q) => answers[q.id] !== undefined);

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [blockId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (isLastQuestion) {
          if (allQuestionsAnswered) {
            onBlockComplete();
          }
        } else if (answers[currentQuestion?.id] !== undefined) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLastQuestion, allQuestionsAnswered, answers, currentQuestion, onBlockComplete]);
  const answeredInBlock = questions.filter((q) => answers[q.id] !== undefined).length;
  const unansweredCount = questions.length - answeredInBlock;

  const handleAnswer = (questionId, value, optionIndex) => {
    onAnswer(questionId, value, optionIndex);
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (blockId > 1) {
      onPreviousBlock();
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleComplete = () => {
    if (allQuestionsAnswered) {
      onBlockComplete();
    }
  };

  if (!block || !currentQuestion) {
    return <div>Loading...</div>;
  }

  const canGoBack = !(isFirstQuestion && blockId === 1);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-white rounded-xl p-6 mb-6" style={{ background: colors.gradient }}>
        <h2 className="text-2xl font-bold mb-2">{block.title}</h2>
        <p className="text-white/80">{block.instruction}</p>
        {block.responseScale.note && (
          <p className="mt-3 text-sm bg-white/20 rounded-lg p-3">
            {block.responseScale.note}
          </p>
        )}
      </div>

      <div className="mb-4 text-sm text-center" style={{ color: colors.accent }}>
        Вопрос {currentQuestionIndex + 1} из {questions.length} в этом блоке
      </div>

      <Question
        question={currentQuestion}
        options={block.responseScale.options}
        selectedValue={answers[currentQuestion.id]}
        selectedIndex={answerIndices[currentQuestion.id]}
        onAnswer={handleAnswer}
        accentColor={colors.accent}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={!canGoBack}
          className="px-6 py-3 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: canGoBack ? colors.light : '#e5e7eb',
            color: canGoBack ? colors.accent : '#9ca3af',
            cursor: canGoBack ? 'pointer' : 'not-allowed',
            borderWidth: '2px',
            borderColor: canGoBack ? colors.accent : 'transparent',
          }}
        >
          Назад
        </button>

        {isLastQuestion ? (
          allQuestionsAnswered ? (
            <button
              onClick={handleComplete}
              className="px-6 py-3 text-white rounded-lg font-medium transition-all hover:scale-105"
              style={{ backgroundColor: '#00d4a8' }}
            >
              {blockId === 4 ? 'Завершить' : 'Следующий блок'}
            </button>
          ) : (
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: colors.accent }}>
                Пропущено вопросов: {unansweredCount}
              </p>
              <p className="text-xs text-gray-400">
                Вернитесь и ответьте на все вопросы
              </p>
            </div>
          )
        ) : (
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="px-6 py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: answers[currentQuestion.id] === undefined
                ? '#e5e7eb'
                : colors.accent,
              color: answers[currentQuestion.id] === undefined
                ? '#9ca3af'
                : 'white',
              cursor: answers[currentQuestion.id] === undefined
                ? 'not-allowed'
                : 'pointer'
            }}
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
}
