import questionnaireData from '../data/questionnaire.json';

const { subscales, scales, questions } = questionnaireData;

export function calculateSubscaleScore(subscaleName, answers) {
  const subscale = subscales[subscaleName];
  if (!subscale) return 0;

  let total = 0;
  const reversedSet = new Set(subscale.reversed || []);

  for (const questionId of subscale.questions) {
    const answer = answers[questionId];
    if (answer === undefined) continue;

    const question = questions.find(q => q.id === questionId);
    if (!question) continue;

    let value = answer;

    if (reversedSet.has(questionId) || question.reversed) {
      if (subscaleName === 'stai' || subscaleName === 'bis' || subscaleName === 'bas') {
        value = 5 - answer;
      } else {
        value = 6 - answer;
      }
    }

    total += value;
  }

  return total;
}

export function calculateAllSubscales(answers) {
  const results = {};

  for (const subscaleName of Object.keys(subscales)) {
    results[subscaleName] = {
      total: calculateSubscaleScore(subscaleName, answers),
      name: subscales[subscaleName].name,
    };
  }

  return results;
}

export function calculateNeurotransmitterScales(answers) {
  const subscaleResults = calculateAllSubscales(answers);
  const results = {};

  // Serotonin: 0.6 * (neuroticism.total - 24) / 96 + 0.4 * (stai.total - 20) / 60
  const neuroticismTotal = subscaleResults.neuroticism.total;
  const staiTotal = subscaleResults.stai.total;
  const serotoninRaw = 0.6 * (neuroticismTotal - 24) / 96 + 0.4 * (staiTotal - 20) / 60;
  results.serotonin = {
    value: Math.max(0, Math.min(1, serotoninRaw)),
    rawValue: serotoninRaw,
    name: scales.serotonin.name,
    nameEn: scales.serotonin.nameEn,
    description: scales.serotonin.description,
    interpretation: getInterpretation(serotoninRaw, scales.serotonin.interpretation),
  };

  // Dopamine: 0.35 * (novelty_seeking.total - 34) / 136 + 0.35 * (bas.total - 13) / 39 - 0.30 * (shaps.total / 14)
  const noveltyTotal = subscaleResults.novelty_seeking.total;
  const basTotal = subscaleResults.bas.total;
  const shapsTotal = subscaleResults.shaps.total;
  const dopamineRaw = 0.35 * (noveltyTotal - 34) / 136 + 0.35 * (basTotal - 13) / 39 - 0.30 * (shapsTotal / 14);
  const dopamineNormalized = (dopamineRaw + 0.30) / 1.0;
  results.dopamine = {
    value: Math.max(0, Math.min(1, dopamineNormalized)),
    rawValue: dopamineRaw,
    name: scales.dopamine.name,
    nameEn: scales.dopamine.nameEn,
    description: scales.dopamine.description,
    interpretation: getInterpretation(dopamineRaw, scales.dopamine.interpretation),
  };

  // Noradrenaline: (reward_dependence.total - 40) / 160
  const rewardTotal = subscaleResults.reward_dependence.total;
  const noradrenalineRaw = (rewardTotal - 40) / 160;
  results.noradrenaline = {
    value: Math.max(0, Math.min(1, noradrenalineRaw)),
    rawValue: noradrenalineRaw,
    name: scales.noradrenaline.name,
    nameEn: scales.noradrenaline.nameEn,
    description: scales.noradrenaline.description,
    interpretation: getInterpretation(noradrenalineRaw, scales.noradrenaline.interpretation),
  };

  // GABA: (bis.total - 7) / 21
  const bisTotal = subscaleResults.bis.total;
  const gabaRaw = (bisTotal - 7) / 21;
  results.gaba = {
    value: Math.max(0, Math.min(1, gabaRaw)),
    rawValue: gabaRaw,
    name: scales.gaba.name,
    nameEn: scales.gaba.nameEn,
    description: scales.gaba.description,
    interpretation: getInterpretation(gabaRaw, scales.gaba.interpretation),
  };

  return {
    scales: results,
    subscales: subscaleResults,
  };
}

function getInterpretation(value, interpretationRules) {
  if (interpretationRules.low && value <= interpretationRules.low.max) {
    return interpretationRules.low;
  }
  if (interpretationRules.high && value >= interpretationRules.high.min) {
    return interpretationRules.high;
  }
  return interpretationRules.medium;
}

export function getQuestionsByBlock(blockId) {
  const block = questionnaireData.blocks.find(b => b.id === blockId);
  if (!block) return [];

  const [start, end] = block.questionsRange;
  return questions.filter(q => q.id >= start && q.id <= end);
}

export function getBlockInfo(blockId) {
  return questionnaireData.blocks.find(b => b.id === blockId);
}

export function getTotalBlocks() {
  return questionnaireData.blocks.length;
}

export function getTotalQuestions() {
  return questionnaireData.meta.totalQuestions;
}

export function getMetaInfo() {
  return questionnaireData.meta;
}
