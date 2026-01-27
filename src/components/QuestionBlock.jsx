import { useState, useEffect } from 'react';
import Question from './Question';
import { getQuestionsByBlock, getBlockInfo } from '../utils/scoring';

export default function QuestionBlock({
  blockId,
  answers,
  onAnswer,
  onBlockComplete,
  onPreviousBlock,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const block = getBlockInfo(blockId);
  const questions = getQuestionsByBlock(blockId);

  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [blockId]);

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const allQuestionsAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = (questionId, value) => {
    onAnswer(questionId, value);

    if (!isLastQuestion) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    }
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-white rounded-xl p-6 mb-6" style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}>
        <h2 className="text-2xl font-bold mb-2">{block.title}</h2>
        <p className="text-fuchsia-100">{block.instruction}</p>
        {block.responseScale.note && (
          <p className="mt-3 text-sm bg-white/20 rounded-lg p-3">
            {block.responseScale.note}
          </p>
        )}
      </div>

      <div className="mb-4 text-sm text-center" style={{ color: '#d946ef' }}>
        Вопрос {currentQuestionIndex + 1} из {questions.length} в этом блоке
      </div>

      <Question
        question={currentQuestion}
        options={block.responseScale.options}
        selectedValue={answers[currentQuestion.id]}
        onAnswer={handleAnswer}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion && blockId === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstQuestion && blockId === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Назад
        </button>

        {isLastQuestion && allQuestionsAnswered ? (
          <button
            onClick={handleComplete}
            className="px-6 py-3 text-white rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#00d4a8' }}
          >
            {blockId === 4 ? 'Завершить' : 'Следующий блок'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isLastQuestion || answers[currentQuestion.id] === undefined}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: isLastQuestion || answers[currentQuestion.id] === undefined
                ? '#e5e7eb'
                : '#ff00ff',
              color: isLastQuestion || answers[currentQuestion.id] === undefined
                ? '#9ca3af'
                : 'white',
              cursor: isLastQuestion || answers[currentQuestion.id] === undefined
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
