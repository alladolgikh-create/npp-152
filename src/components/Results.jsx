const scaleColors = {
  serotonin: { accent: '#ff00ff', label: 'Серотонин', labelEn: 'Serotonin' },
  dopamine: { accent: '#39ff14', label: 'Дофамин', labelEn: 'Dopamine' },
  noradrenaline: { accent: '#00cec9', label: 'Норадреналин', labelEn: 'Noradrenaline' },
  gaba: { accent: '#ff6b6b', label: 'ГАМК', labelEn: 'GABA' },
};

// Map English labels to Russian
const interpretationMap = {
  'Low': 'Низкий',
  'Medium': 'Средний',
  'High': 'Высокий',
};

const interpretationBadges = {
  'Низкий': { bg: '#39ff1422', text: '#39ff14' },
  'Средний': { bg: '#ff00ff22', text: '#ff00ff' },
  'Высокий': { bg: '#ff6b6b22', text: '#ff6b6b' },
};

// Map ASCII arrows to Unicode
const arrowMap = {
  '^': '↑',
  'v': '↓',
  '-': '→',
};

// Arrow colors (independent of system colors)
const arrowColors = {
  '↑': '#4ade80', // green - high
  '↓': '#f87171', // red - low
  '→': '#fbbf24', // yellow - medium
};

// Formula system renderer
function FormulaSystem({ system }) {
  const { label, color, index, subscales } = system;

  return (
    <span style={{ fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'baseline' }}>
      {/* System label - bright, 100% */}
      <span style={{ color, fontWeight: 600 }}>{label}</span>
      {/* Index as superscript */}
      <sup style={{ color, opacity: 0.8, fontSize: '0.65em', marginLeft: '1px' }}>
        {Math.round(index)}
      </sup>
      {/* Subscales in parentheses - same size, muted color */}
      <span style={{ fontWeight: 400, marginLeft: '2px' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>(</span>
        {subscales.map((sub, i) => {
          const arrow = arrowMap[sub.direction] || sub.direction;
          const arrowColor = arrowColors[arrow];
          return (
            <span key={i}>
              {i > 0 && <span style={{ color: 'rgba(255,255,255,0.25)' }}> </span>}
              <span style={{ color, opacity: 0.6 }}>{sub.label}</span>
              <span style={{ color: arrowColor }}>{arrow}</span>
            </span>
          );
        })}
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>)</span>
      </span>
    </span>
  );
}

// Formula block component
function FormulaBlock({ formula }) {
  if (!formula) return null;

  const { top, bottom } = formula;

  return (
    <div className="mb-8">
      {/* Title */}
      <p className="mb-4 text-sm" style={{ fontFamily: 'var(--font-mono)', color: '#555555' }}>
        // ваша персональная <span style={{ color: '#ff00ff' }}>формула</span>
      </p>

      {/* Formula card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}
      >
        {/* Gradient glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(to right, #ff00ff, #39ff14)' }}
        />

        {/* Formula content */}
        <div className="text-center py-4" style={{ fontFamily: 'var(--font-mono)' }}>
          {/* Top row - leading systems */}
          <div className="text-lg md:text-xl mb-4 flex justify-center items-center flex-wrap gap-x-2">
            {top.map((sys, i) => (
              <span key={sys.system}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>·</span>}
                <FormulaSystem system={sys} />
              </span>
            ))}
          </div>

          {/* Divider line with gradient */}
          <div
            className="mx-auto mb-4"
            style={{
              height: '1px',
              maxWidth: '90%',
              background: 'linear-gradient(to right, transparent, #ff00ff, #39ff14, #00cec9, #ff6b6b, transparent)',
            }}
          />

          {/* Bottom row - other systems */}
          <div className="text-lg md:text-xl flex justify-center items-center flex-wrap gap-x-2">
            {bottom.map((sys, i) => (
              <span key={sys.system}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>·</span>}
                <FormulaSystem system={sys} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Combined action block
function ActionBlock() {
  return (
    <div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}
    >
      <p className="mb-4 text-center" style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7 }}>
        Чтобы сохранить результат, сделайте скриншот
      </p>
      <p className="mb-6 text-center" style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7 }}>
        Если вам интересно подробней узнать о том, к каким сферам и как именно можно применять знания своего профиля, то добро пожаловать
      </p>
      <div className="flex justify-center">
        <a
          href="https://t.me/crazymethods"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg transition-all hover:brightness-110"
          style={{
            backgroundColor: 'rgba(255,0,255,0.1)',
            border: '1px solid rgba(255,0,255,0.25)',
            color: '#ff00ff',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Сходить в гости
        </a>
      </div>
    </div>
  );
}

export default function Results({ results, userName, onRestart }) {
  const { scales, formula } = results;

  // Debug: log formula structure
  console.log('Formula data:', JSON.stringify(formula, null, 2));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Logo - Terminal-style header (identical to WelcomeScreen) */}
      <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
        <div style={{ fontFamily: 'var(--font-mono)' }} className="text-left text-sm mb-4">
          <p style={{ color: '#888888' }}>// нейрохимическое профилирование</p>
          <p>
            <span style={{ color: '#ff6b6b' }}>run</span>
            {' '}
            <span style={{ color: '#00cec9' }}>test</span>
            <span style={{ color: '#888888' }}>(</span>
            <span style={{ color: '#39ff14' }}>"brain"</span>
            <span style={{ color: '#888888' }}>) {'{'}</span>
          </p>
        </div>
        <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>ВПРГМД-152</h1>
        <div style={{ fontFamily: 'var(--font-mono)' }} className="text-left text-sm mt-4">
          <p style={{ color: '#888888' }}>{'}'}</p>
          <p style={{ color: '#555555' }}>// → 152 вопроса → ваш уникальный профиль</p>
        </div>
      </div>

      {/* Header - name and results title */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl font-medium"
          style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}
        >
          {userName}, ваши результаты по итогу прохождения теста
        </h2>
      </div>

      {/* Scale cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {Object.entries(scales).map(([key, scale]) => {
          const colors = scaleColors[key];
          const percentage = Math.round(scale.value * 100);
          const interpLabel = interpretationMap[scale.interpretation.label] || scale.interpretation.label;
          const badge = interpretationBadges[interpLabel] || interpretationBadges['Средний'];

          return (
            <div
              key={key}
              className="rounded-xl p-6"
              style={{
                backgroundColor: '#1a1a2e',
                borderLeft: `4px solid ${colors.accent}`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.accent, fontFamily: 'var(--font-mono)' }}>
                    {colors.label}
                  </h3>
                  <p className="text-sm" style={{ color: '#555555' }}>{colors.labelEn}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold" style={{ color: colors.accent, fontFamily: 'var(--font-mono)' }}>
                    {percentage}%
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#252540' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: colors.accent }}
                  />
                </div>
              </div>

              <div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {interpLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Personalized Formula */}
      <FormulaBlock formula={formula} />

      {/* Action Block */}
      <ActionBlock />

      <div className="text-center mb-8">
        <button
          onClick={onRestart}
          className="px-8 py-4 rounded-xl font-medium transition-all hover:brightness-110"
          style={{ backgroundColor: '#252540', color: '#888888', border: '1px solid #333333' }}
        >
          Пройти опросник заново
        </button>
      </div>

      <div className="text-center text-sm pb-4" style={{ color: '#555555' }}>
        <p className="mb-2">
          Данные результаты носят информационный характер и не являются медицинским диагнозом.
        </p>
        <p>Опросник спроектирован <span style={{ color: '#ff00ff' }}>Аллой Долгих</span></p>
      </div>
    </div>
  );
}
