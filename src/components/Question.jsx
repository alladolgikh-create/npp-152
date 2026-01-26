export default function Question({ question, options, selectedValue, onAnswer }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <p className="text-lg font-medium text-gray-800 mb-6">
        <span className="text-blue-500 font-bold mr-2">{question.id}.</span>
        {question.text}
      </p>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, option.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedValue === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedValue === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedValue === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-gray-700">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
