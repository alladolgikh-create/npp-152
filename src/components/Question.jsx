export default function Question({ question, options, selectedValue, selectedIndex, onAnswer, accentColor = '#ff00ff' }) {
  return (
    <div className="rounded-xl p-6 mb-4" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
      <p className="text-lg font-medium mb-6" style={{ color: '#e0e0e0', fontSize: '17px' }}>
        <span className="font-bold mr-2" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>{question.id}.</span>
        {question.text}
      </p>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedIndex !== undefined ? selectedIndex === index : selectedValue === option.value;
          return (
            <button
              key={index}
              onClick={() => onAnswer(question.id, option.value, index)}
              className="w-full text-left p-4 rounded-lg transition-all duration-200"
              style={{
                border: `2px solid ${isSelected ? accentColor : '#333333'}`,
                backgroundColor: isSelected ? accentColor + '11' : '#252540',
                color: isSelected ? accentColor : '#e0e0e0',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#252540';
                  e.currentTarget.style.borderColor = '#555555';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#252540';
                  e.currentTarget.style.borderColor = '#333333';
                }
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? accentColor : '#555555',
                    backgroundColor: isSelected ? accentColor : 'transparent'
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0a0a0a' }} />
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
