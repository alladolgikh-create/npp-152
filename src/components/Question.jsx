export default function Question({ question, options, selectedValue, selectedIndex, onAnswer, accentColor = '#ff00ff' }) {
  const lightBg = accentColor + '15';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <p className="text-lg font-medium text-gray-800 mb-6">
        <span className="font-bold mr-2" style={{ color: accentColor }}>{question.id}.</span>
        {question.text}
      </p>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedIndex !== undefined ? selectedIndex === index : selectedValue === option.value;
          return (
            <button
              key={index}
              onClick={() => onAnswer(question.id, option.value, index)}
              className="w-full text-left p-4 rounded-lg border-2 transition-all duration-200"
              style={{
                borderColor: isSelected ? accentColor : '#e5e7eb',
                backgroundColor: isSelected ? lightBg : 'white',
                color: isSelected ? accentColor : '#374151'
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? accentColor : '#d1d5db',
                    backgroundColor: isSelected ? accentColor : 'transparent'
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
