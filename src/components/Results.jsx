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

              <div className="mb-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: interpretationColor }}
                >
                  {scale.interpretation.label}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-2">
                {scale.description}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {scale.interpretation.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-6 text-white mb-8" style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}>
        <h3 className="text-xl font-bold mb-4">Интерпретация результатов</h3>
        <div className="space-y-3 text-fuchsia-100">
          <p>
            <strong className="text-white">Серотонин</strong> отражает вашу эмоциональную стабильность.
            Низкие значения указывают на устойчивость к стрессу, высокие - на склонность к тревожности.
          </p>
          <p>
            <strong className="text-white">Дофамин</strong> связан с мотивацией и поиском новизны.
            Высокие значения говорят об активной жизненной позиции и стремлении к новым впечатлениям.
          </p>
          <p>
            <strong className="text-white">Норадреналин</strong> отражает социальную чувствительность.
            Высокие значения указывают на эмоциональную отзывчивость и потребность в социальных связях.
          </p>
          <p>
            <strong className="text-white">ГАМК</strong> связан с контролем импульсов.
            Высокие значения говорят о развитом самоконтроле и осторожности.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}
        >
          Пройти опросник заново
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Данные результаты носят информационный характер и не являются медицинским диагнозом.
        </p>
      </div>
    </div>
  );
}
