import RadarChart from './RadarChart';

const scaleColors = {
  serotonin: { bg: '#fff0fa', border: '#ff00ff', text: '#d946ef' },
  dopamine: { bg: '#fdf2f8', border: '#ff00aa', text: '#ff00aa' },
  noradrenaline: { bg: '#f0fdfa', border: '#00d4a8', text: '#00a080' },
  gaba: { bg: '#faf5ff', border: '#d946ef', text: '#a855f7' },
};

const interpretationColors = {
  'Низкий': '#00d4a8',
  'Средний': '#d946ef',
  'Высокий': '#ff00aa',
};

export default function Results({ results, userName, onRestart }) {
  const { scales } = results;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-50 to-fuchsia-50 p-4 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#ff00ff' }}>
            {userName}, ваш нейротрансмиттерный профиль
          </h1>
          <p style={{ color: '#d946ef' }}>
            Результаты опросника NPP-152
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <RadarChart results={scales} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(scales).map(([key, scale]) => {
            const colors = scaleColors[key];
            const percentage = Math.round(scale.value * 100);
            const interpretationColor = interpretationColors[scale.interpretation.label];

            return (
              <div
                key={key}
                className="rounded-xl p-6 border-2"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                      {scale.name}
                    </h3>
                    <p className="text-sm text-gray-600">{scale.nameEn}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold" style={{ color: colors.text }}>
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: interpretationColor }}
                    />
                  </div>
                </div>

                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: interpretationColor }}
                  >
                    {scale.interpretation.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl p-6 mb-8 text-center" style={{ backgroundColor: '#fff0fa' }}>
        <p className="mb-2" style={{ color: '#d946ef' }}>
          Чтобы сохранить результат, сделайте скриншот
        </p>
        <p className="mb-4" style={{ color: '#d946ef' }}>
          Для запроса персональной интерпретации результатов пишите <strong>Алле Долгих</strong> в Telegram
        </p>
        <div className="flex justify-center">
          <a
            href="https://t.me/AllokDolgikh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}
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
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-medium transition-all hover:bg-gray-300"
        >
          Пройти опросник заново
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 pb-4">
        <p className="mb-2">
          Данные результаты носят информационный характер и не являются медицинским диагнозом.
        </p>
        <p>Опросник спроектирован <span style={{ color: '#d946ef' }}>Аллой Долгих</span></p>
      </div>
    </div>
  );
}
