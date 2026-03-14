import RadarChart from './RadarChart';

const scaleColors = {
  serotonin: { accent: '#ff00ff', label: 'Серотонин' },
  dopamine: { accent: '#39ff14', label: 'Дофамин' },
  noradrenaline: { accent: '#00cec9', label: 'Норадреналин' },
  gaba: { accent: '#ff6b6b', label: 'ГАМК' },
};

const interpretationBadges = {
  'Низкий': { bg: '#39ff1422', text: '#39ff14' },
  'Средний': { bg: '#ff00ff22', text: '#ff00ff' },
  'Высокий': { bg: '#ff6b6b22', text: '#ff6b6b' },
};

export default function Results({ results, userName, onRestart }) {
  const { scales } = results;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Terminal-style header */}
      <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
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
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>ВПРГМД-152</h1>
        <div style={{ fontFamily: 'var(--font-mono)' }} className="text-left text-sm mt-4">
          <p style={{ color: '#888888' }}>{'}'}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>
          {userName}, ваш нейрохимический профиль
        </h2>
        <p style={{ color: '#888888' }}>
          Результаты опросника ВПРГМД-152
        </p>
      </div>

      {/* Radar chart */}
      <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
        <RadarChart results={scales} />
      </div>

      {/* Scale cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {Object.entries(scales).map(([key, scale]) => {
          const colors = scaleColors[key];
          const percentage = Math.round(scale.value * 100);
          const badge = interpretationBadges[scale.interpretation.label] || interpretationBadges['Средний'];

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
                    {scale.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#555555' }}>{scale.nameEn}</p>
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
                  {scale.interpretation.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="rounded-xl p-6 mb-8 text-center" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
        <p className="mb-2" style={{ color: '#888888' }}>
          Чтобы сохранить результат, сделайте скриншот
        </p>
        <p className="mb-4" style={{ color: '#888888' }}>
          Для запроса персональной интерпретации результатов пишите <strong style={{ color: '#ff00ff' }}>Алле Долгих</strong> в Telegram
        </p>
        <div className="flex justify-center">
          <a
            href="https://t.me/AllokDolgikh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-white rounded-xl font-medium transition-all hover:brightness-110 hover:scale-105 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, #ff00ff, #ff6b6b)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Написать в Telegram
          </a>
        </div>
      </div>

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
