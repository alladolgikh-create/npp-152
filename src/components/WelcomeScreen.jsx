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
      {/* Terminal-style header */}
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

      {/* Name input */}
      <div className="rounded-xl p-8 mb-8" style={{ backgroundColor: '#111111', border: '1px solid #333333' }}>
        <div className="mb-8">
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Впишите ваши Имя и Фамилию, пожалуйста"
            className="w-full px-4 py-4 rounded-xl text-center text-lg transition-colors outline-none"
            style={{
              backgroundColor: '#1a1a2e',
              border: '2px solid #333333',
              color: '#e0e0e0',
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff00ff'}
            onBlur={(e) => e.target.style.borderColor = '#333333'}
          />
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>
          Об опроснике
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
            <p className="text-3xl font-bold" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>{meta.totalQuestions}</p>
            <p style={{ color: '#888888' }}>вопросов</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
            <p className="text-3xl font-bold" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>{meta.blocks}</p>
            <p style={{ color: '#888888' }}>блока</p>
          </div>
          <div className="rounded-lg p-4 col-span-2" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
            <p className="text-2xl font-bold" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>{meta.estimatedTime}</p>
            <p style={{ color: '#888888' }}>примерное время прохождения</p>
          </div>
        </div>

        <div className="text-left space-y-4 mb-8">
          <h3 className="text-lg font-semibold" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>
            Что измеряет опросник:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#ff00ff' }}></span>
              <span style={{ color: '#e0e0e0' }}>
                <strong style={{ color: '#ff00ff' }}>Серотонин</strong> — эмоциональная стабильность и регуляция тревожности
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#39ff14' }}></span>
              <span style={{ color: '#e0e0e0' }}>
                <strong style={{ color: '#39ff14' }}>Дофамин</strong> — мотивация, вознаграждение и поиск новизны
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#00cec9' }}></span>
              <span style={{ color: '#e0e0e0' }}>
                <strong style={{ color: '#00cec9' }}>Норадреналин</strong> — социальная привязанность и эмоциональная отзывчивость
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0" style={{ backgroundColor: '#ff6b6b' }}></span>
              <span style={{ color: '#e0e0e0' }}>
                <strong style={{ color: '#ff6b6b' }}>ГАМК</strong> — торможение и контроль импульсов
              </span>
            </li>
          </ul>
        </div>

        <div className="text-left mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#ff00ff', fontFamily: 'var(--font-mono)' }}>
            Научная основа
          </h3>
          <p className="text-sm italic mb-3" style={{ color: '#888888' }}>
            Данный опросник представляет собой комплексную методику, объединяющую несколько валидированных психометрических инструментов:
          </p>
          <ol className="text-sm italic space-y-1 list-decimal list-inside" style={{ color: '#888888' }}>
            <li>IPIP-NEO-120 (международный личностный опросник из открытого пула IPIP)</li>
            <li>IPIP-TCI (открытый аналог Опросника темперамента и характера Клонингера)</li>
            <li>STAI (шкала тревожности Спилберга-Ханина)</li>
            <li>BIS/BAS (опросник Кавера-Уайта, позволяет определить чувствительность человека к положительным и отрицательным стимулам)</li>
            <li>SHAPS (Шкала оценки ангедонии Снайта-Гамильтона оценивает четыре составные части гедонии/ангедонии: интерес, социальная активность, сфера чувств, аппетит)</li>
          </ol>
          <p className="text-sm italic mt-3" style={{ color: '#888888' }}>
            Все исходные инструменты находятся в открытом доступе (Public Domain) или имеют валидированные русскоязычные адаптации.
          </p>
        </div>

        <div className="rounded-lg p-4 mb-4 text-left" style={{ backgroundColor: '#1a1a2e', border: '1px solid #ff00ff33' }}>
          <p className="text-sm" style={{ color: '#ff00ff' }}>
            <strong>Рекомендации:</strong> Отвечайте на вопросы быстро и честно,
            основываясь на первом впечатлении. Не существует правильных или
            неправильных ответов — важно только ваше личное восприятие.
          </p>
        </div>

        <div className="rounded-lg p-4 mb-8 text-left" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333333' }}>
          <p className="text-sm" style={{ color: '#888888' }}>
            <strong style={{ color: '#ff6b6b' }}>Важно:</strong> Результаты опросника не могут быть достоверны на 100%, поскольку абсолютную точность может обеспечить только лабораторный анализ крови на уровень нейромедиаторов. Однако, учитывая, что концентрация нейромедиаторов меняется в течение дня, для задач, для которых был спроектирован данный опросник, его результаты более релевантны, чем разовый анализ крови.
          </p>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-md px-8 py-4 text-white text-xl font-medium rounded-xl transition-all hover:brightness-110 hover:scale-105 mb-8"
        style={{ backgroundColor: '#ff00ff' }}
      >
        Начать опрос
      </button>

      <footer className="text-center text-sm pb-4" style={{ color: '#555555' }}>
        <p>Опросник спроектирован <span style={{ color: '#ff00ff' }}>Аллой Долгих</span></p>
      </footer>
    </div>
  );
}
