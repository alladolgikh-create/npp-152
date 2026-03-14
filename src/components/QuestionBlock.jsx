import { useState, useEffect } from 'react';
import Question from './Question';
import questionnaire from '../data/questionnaire.json';

const blockColors = {
  1: { accent: '#ff00ff', dark: '#ff00ff22' },
  2: { accent: '#39ff14', dark: '#39ff1422' },
  3: { accent: '#00cec9', dark: '#00cec922' },
  4: { accent: '#ff6b6b', dark: '#ff6b6b22' },
};

function getBlockInfo(blockId) {
  return questionnaire.blocks.find((b) => b.id === blockId);
}

function getQuestionsByBlock(blockId) {
  const block = getBlockInfo(blockId);
  if (!block) return [];
  const [start, end] = block.questionsRange;
  return questionnaire.questions.filter((q) => q.id >= start && q.id <= end);
}

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
    return <div style={{ color: '#888888' }}>Loading...</div>;
  }

  const canGoBack = !(isFirstQuestion && blockId === 1);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#1a1a2e', border: `1px solid ${colors.accent}44` }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.accent, fontFamily: 'var(--font-mono)' }}>{block.title}</h2>
        <p style={{ color: '#888888' }}>{block.instruction}</p>
        {block.responseScale.note && (
          <p className="mt-3 text-sm rounded-lg p-3" style={{ backgroundColor: colors.dark, color: '#e0e0e0' }}>
            {block.responseScale.note}
          </p>
        )}
      </div>

      <div className="mb-4 text-sm text-center" style={{ color: colors.accent, fontFamily: 'var(--font-mono)' }}>
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
            backgroundColor: canGoBack ? 'transparent' : '#1a1a2e',
            color: canGoBack ? colors.accent : '#555555',
            cursor: canGoBack ? 'pointer' : 'not-allowed',
            border: `2px solid ${canGoBack ? colors.accent : '#333333'}`,
          }}
        >
          Назад
        </button>

        {isLastQuestion ? (
          allQuestionsAnswered ? (
            <button
              onClick={handleComplete}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:brightness-110"
              style={{ backgroundColor: colors.accent, color: '#0a0a0a', fontWeight: 'bold' }}
            >
              {blockId === 4 ? 'Завершить' : 'Следующий блок'}
            </button>
          ) : (
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: '#ff6b6b' }}>
                Пропущено вопросов: {unansweredCount}
              </p>
              <p className="text-xs" style={{ color: '#555555' }}>
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
                ? '#1a1a2e'
                : colors.accent,
              color: answers[currentQuestion.id] === undefined
                ? '#555555'
                : '#0a0a0a',
              cursor: answers[currentQuestion.id] === undefined
                ? 'not-allowed'
                : 'pointer',
              border: `2px solid ${answers[currentQuestion.id] === undefined ? '#333333' : colors.accent}`,
              fontWeight: 'bold',
            }}
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
}
