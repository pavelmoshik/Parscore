// src/modules/liveMatchParser.js

import axios from 'axios';
import { HEADERS, buildApiUrl, isLiveLeagueAllowed } from '../config.js';

/**
 * Статическая часть URL для лайв-матчей.
 */
const STATIC_PART = 'df_st_1_';

/**
 * Получает и обрабатывает данные о лайв-матчах.
 *
 * @param {Object} structuredData - Структурированные данные о лигах и матчах.
 */
export const fetchLiveMatchData = async (structuredData) => {
  try {
    // Получаем идентификаторы лайв-матчей
    const filteredMatchIds = getFilteredLiveMatchIds(structuredData);

    if (filteredMatchIds.length === 0) {
      console.log("Нет матчей, соответствующих критериям фильтрации.");
      return;
    }

    console.log("Отфильтрованные идентификаторы матчей:", filteredMatchIds);

    // Параллельные запросы к API
    const fetchPromises = filteredMatchIds.map(matchId => fetchMatchData(matchId));
    const results = await Promise.allSettled(fetchPromises);

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { matchId, data } = result.value;
        const structuredMatchData = structureMatchData(data, matchId);
        console.log(`Данные для матча ${matchId} структурированы.`);
        // Здесь можно добавить обработку или сохранение структурированных данных
      } else {
        console.error(`Ошибка при получении лайв-матча: ${result.reason}`);
      }
    });
  } catch (error) {
    console.error(`Ошибка в fetchLiveMatchData: ${error.message}`);
  }
};

/**
 * Фильтрует и возвращает идентификаторы матчей, соответствующих критериям.
 *
 * @param {Object} structuredData - Структурированные данные.
 * @returns {Array<string>} Массив идентификаторов матчей.
 */
const getFilteredLiveMatchIds = (structuredData) => {
  return Object.values(structuredData).flatMap(([leagueInfo, matches]) =>
    isLiveLeagueAllowed(leagueInfo['ZC'])
      ? matches.filter(match => match['AB'] === '2').map(match => match['~AA'])
      : []
  );
};

/**
 * Получает данные матча по идентификатору.
 *
 * @param {string} matchId - Идентификатор матча.
 * @returns {Promise<Object>} Объект с matchId и данными матча.
 */
const fetchMatchData = async (matchId) => {
  const fullUrl = buildApiUrl(`${STATIC_PART}${matchId}`);
  console.log(`Формируемый URL: ${fullUrl}`);

  try {
    const response = await axios.get(fullUrl, { headers: HEADERS });
    console.log(`Данные для матча '${matchId}' получены.`);
    return { matchId, data: response.data };
  } catch (error) {
    console.error(`Ошибка при получении лайв-матча для ${matchId}: ${error.message}`);
    throw error;
  }
};

/**
 * Структурирует данные матча.
 *
 * @param {string} data - Сырые данные матча.
 * @param {string} matchId - Идентификатор матча.
 * @returns {Object} Структурированные данные матча.
 */
const structureMatchData = (data, matchId) => {
  const sections = data.split('¬~SE÷').slice(1);

  return {
    [matchId]: sections.reduce((acc, section, index) => {
      const sectionKey = `SE_${index + 1}`;
      const stats = section.split('¬~SG÷').slice(1).map(stat => (
        Object.fromEntries(stat.split('¬').map(entry => entry.split('÷')))
      ));
      acc[sectionKey] = { SG: stats };
      return acc;
    }, {})
  };
};
