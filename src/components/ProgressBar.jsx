export default function ProgressBar({ current, total, currentBlock, totalBlocks }) {
  const percentage = Math.round((current / total) * 100);
  const pad = (n) => String(n).padStart(3, '0');

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
        <span className="text-sm font-medium" style={{ color: '#888888' }}>
          Блок {currentBlock} из {totalBlocks}
        </span>
        <span className="text-sm font-medium" style={{ color: '#888888' }}>
          {pad(current)} / {pad(total)}
        </span>
      </div>
      <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(to right, #ff00ff, #39ff14)',
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4].map((block) => {
          const blockAccents = { 1: '#ff00ff', 2: '#39ff14', 3: '#00cec9', 4: '#ff6b6b' };
          const accent = blockAccents[block];
          const isCompleted = block < currentBlock;
          const isCurrent = block === currentBlock;
          return (
            <div
              key={block}
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: isCompleted ? accent : isCurrent ? accent : '#1a1a2e',
                color: isCompleted || isCurrent ? '#0a0a0a' : '#555555',
                border: `1px solid ${isCompleted || isCurrent ? accent : '#333333'}`,
                fontFamily: 'var(--font-mono)',
                fontWeight: 'bold',
              }}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                block
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
