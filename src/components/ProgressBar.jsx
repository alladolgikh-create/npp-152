const blockColors = {
  1: { accent: '#ff00ff', gradient: 'linear-gradient(to right, #ff00ff, #d946ef)' },
  2: { accent: '#d946ef', gradient: 'linear-gradient(to right, #d946ef, #a855f7)' },
  3: { accent: '#ff00aa', gradient: 'linear-gradient(to right, #ff00aa, #ff00ff)' },
  4: { accent: '#00d4a8', gradient: 'linear-gradient(to right, #00d4a8, #00b894)' },
};

export default function ProgressBar({ current, total, currentBlock, totalBlocks }) {
  const percentage = Math.round((current / total) * 100);
  const colors = blockColors[currentBlock];

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: colors.accent }}>
          Блок {currentBlock} из {totalBlocks}
        </span>
        <span className="text-sm font-medium" style={{ color: colors.accent }}>
          {current} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            background: colors.gradient,
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4].map((block) => {
          const bc = blockColors[block];
          return (
            <div
              key={block}
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: block < currentBlock
                  ? '#00d4a8'
                  : block === currentBlock
                  ? bc.accent
                  : '#e5e7eb',
                color: block <= currentBlock ? 'white' : '#6b7280'
              }}
            >
              {block < currentBlock ? (
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
