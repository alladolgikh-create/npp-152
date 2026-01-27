import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const resultsRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`NPP-152_${userName}_результаты.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось создать PDF. Попробуйте ещё раз.');
    }
  };

  const handleSendResults = () => {
    const subject = encodeURIComponent(`Результаты NPP-152: ${userName}`);
    const body = encodeURIComponent(
      `Здравствуйте, Алла!\n\n` +
      `Направляю результаты прохождения опросника NPP-152.\n\n` +
      `Имя: ${userName}\n\n` +
      `Результаты:\n` +
      `• Серотонин: ${Math.round(scales.serotonin.value * 100)}% (${scales.serotonin.interpretation.label})\n` +
      `• Дофамин: ${Math.round(scales.dopamine.value * 100)}% (${scales.dopamine.interpretation.label})\n` +
      `• Норадреналин: ${Math.round(scales.noradrenaline.value * 100)}% (${scales.noradrenaline.interpretation.label})\n` +
      `• ГАМК: ${Math.round(scales.gaba.value * 100)}% (${scales.gaba.interpretation.label})\n\n` +
      `С уважением,\n${userName}`
    );

    window.open(`mailto:alla.dolgikh@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div ref={resultsRef} className="bg-gradient-to-br from-gray-50 to-fuchsia-50 p-4 rounded-2xl">
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
      </div>

      <div className="rounded-xl p-6 mb-8 text-center" style={{ backgroundColor: '#fff0fa' }}>
        <p className="mb-4" style={{ color: '#d946ef' }}>
          Для персональной интерпретации ваших результатов, пожалуйста, скачайте PDF и направьте его
          <strong> Алле Долгих</strong> — человеку, который дал вам ссылку на этот опросник.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#00d4a8' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Скачать PDF
          </button>
          <button
            onClick={handleSendResults}
            className="px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Отправить по Email
          </button>
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
