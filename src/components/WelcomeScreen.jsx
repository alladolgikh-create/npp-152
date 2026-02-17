import { useState } from 'react';
import questionnaire from '../data/questionnaire.json';

export default function WelcomeScreen({ onStart }) {
  const meta = questionnaire.meta;
  const [userName, setUserName] = useState('');

  const handleStart = () => {
    onStart(userName.trim() || 'Участник');
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Header with code-style logo */}
      <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: '#b3ffe6' }}>
        {/* Code-style logo */}
        <div className="font-mono text-left text-sm mb-4">
          <p style={{ color: 'rgba(0,0,0,0.4)' }}>// нейрохимическое профилирование</p>
          <p>
            <span style={{ color: '#e74c3c' }}>run</span>
            {' '}
            <span style={{ color: '#2980b9' }}>test</span>
            <span style={{ color: '#1a1a2e' }}>(</span>
            <span style={{ color: '#f39c12' }}>"brain"</span>
            <span style={{ color: '#1a1a2e' }}>) {'{'}</span>
          </p>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: '#ff00aa' }}>ВПРГМД-152</h1>

        {/* Closing brace */}
        <div className="font-mono text-left text-sm mt-4">
          <p style={{ color: '#1a1a2e' }}>{'}'}</p>
          <p style={{ color: 'rgba(0,0,0,0.4)' }}>// → 152 вопроса → ваш уникальный профиль</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="mb-8">
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Впишите ваши Имя и Фамилию, пожалуйста"
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors text-center text-lg"
          />
        </div>

        <h2 className="text-2xl font-bold text-purple-600 mb-6">
          Об опроснике
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-fuchsia-500">{meta.totalQuestions}</p>
            <p className="text-gray-600">вопросов</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-500">{meta.blocks}</p>
            <p className="text-gray-600">блока</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 col-span-2">
            <p className="text-2xl font-bold text-teal-500">{meta.estimatedTime}</p>
            <p className="text-gray-600">примерное время прохождения</p>
          </div>
        </div>

        <div className="text-left space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-teal-600">
            Что измеряет опросник:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#00b894' }}></span>
              <span className="text-gray-700">
                <strong style={{ color: '#00b894' }}>Серотонин</strong> - эмоциональная стабильность и регуляция тревожности
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#ff00ff' }}></span>
              <span className="text-gray-700">
                <strong style={{ color: '#ff00ff' }}>Дофамин</strong> - мотивация, вознаграждение и поиск новизны
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#ff00aa' }}></span>
              <span className="text-gray-700">
                <strong style={{ color: '#ff00aa' }}>Норадреналин</strong> - социальная привязанность и эмоциональная отзывчивость
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#d946ef' }}></span>
              <span className="text-gray-700">
                <strong style={{ color: '#d946ef' }}>ГАМК</strong> - торможение и контроль импульсов
              </span>
            </li>
          </ul>
        </div>

        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold text-teal-600 mb-3">
            Научная основа
          </h3>
          <p className="text-sm italic text-gray-600 mb-3">
            Данный опросник представляет собой комплексную методику, объединяющую несколько валидированных психометрических инструментов:
          </p>
          <ol className="text-sm italic text-gray-600 space-y-1 list-decimal list-inside">
            <li>IPIP-NEO-120 (международный личностный опросник из открытого пула IPIP)</li>
            <li>IPIP-TCI (открытый аналог Опросника темперамента и характера Клонингера)</li>
            <li>STAI (шкала тревожности Спилберга-Ханина)</li>
            <li>BIS/BAS (опросник Кавера-Уайта, позволяет определить чувствительность человека к положительным и отрицательным стимулам)</li>
            <li>SHAPS (Шкала оценки ангедонии Снайта-Гамильтона оценивает четыре составные части гедонии/ангедонии: интерес, социальная активность, сфера чувств, аппетит)</li>
          </ol>
          <p className="text-sm italic text-gray-600 mt-3">
            Все исходные инструменты находятся в открытом доступе (Public Domain) или имеют валидированные русскоязычные адаптации.
          </p>
        </div>

        <div className="rounded-lg p-4 mb-4 text-left" style={{ backgroundColor: '#fff0fa' }}>
          <p className="text-sm" style={{ color: '#d946ef' }}>
            <strong>Рекомендации:</strong> Отвечайте на вопросы быстро и честно,
            основываясь на первом впечатлении. Не существует правильных или
            неправильных ответов - важно только ваше личное восприятие.
          </p>
        </div>

        <div className="rounded-lg p-4 mb-8 text-left border" style={{ backgroundColor: '#f0fdfa', borderColor: '#00d4a8' }}>
          <p className="text-sm text-gray-700">
            <strong style={{ color: '#00a080' }}>Важно:</strong> Результаты опросника не могут быть достоверны на 100%, поскольку абсолютную точность может обеспечить только лабораторный анализ крови на уровень нейромедиаторов. Однако, учитывая, что концентрация нейромедиаторов меняется в течение дня, для задач, для которых был спроектирован данный опросник, его результаты более релевантны, чем разовый анализ крови.
          </p>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-md px-8 py-4 text-white text-xl font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 mb-8"
        style={{ background: 'linear-gradient(to right, #ff00ff, #d946ef)' }}
      >
        Начать опрос
      </button>

      <footer className="text-center text-sm text-gray-500 pb-4">
        <p>Опросник спроектирован <span style={{ color: '#d946ef' }}>Аллой Долгих</span></p>
      </footer>
    </div>
  );
}
