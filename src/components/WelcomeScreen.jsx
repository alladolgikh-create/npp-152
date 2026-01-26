import { getMetaInfo } from '../utils/scoring';

export default function WelcomeScreen({ onStart }) {
  const meta = getMetaInfo();

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{meta.name}</h1>
        <p className="text-xl text-blue-100">{meta.nameRu}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Об опроснике
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-blue-600">{meta.totalQuestions}</p>
            <p className="text-gray-600">вопросов</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-600">{meta.blocks}</p>
            <p className="text-gray-600">блока</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 col-span-2">
            <p className="text-2xl font-bold text-green-600">{meta.estimatedTime}</p>
            <p className="text-gray-600">примерное время прохождения</p>
          </div>
        </div>

        <div className="text-left space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800">
            Что измеряет опросник:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full bg-yellow-400 mt-1.5 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">
                <strong>Серотонин</strong> - эмоциональная стабильность и регуляция тревожности
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full bg-pink-400 mt-1.5 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">
                <strong>Дофамин</strong> - мотивация, вознаграждение и поиск новизны
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full bg-blue-400 mt-1.5 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">
                <strong>Норадреналин</strong> - социальная привязанность и эмоциональная отзывчивость
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-3 h-3 rounded-full bg-green-400 mt-1.5 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">
                <strong>ГАМК</strong> - торможение и контроль импульсов
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
          <p className="text-blue-800 text-sm">
            <strong>Рекомендации:</strong> Отвечайте на вопросы быстро и честно,
            основываясь на первом впечатлении. Не существует правильных или
            неправильных ответов - важно только ваше личное восприятие.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        Начать опрос
      </button>
    </div>
  );
}
