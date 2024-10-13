// src/modules/dataProcessor.js

import axios from 'axios';
import {
  HEADERS,
  buildApiUrl,
  isLeagueAllowed,
  FILTERED_KEYS_LEAGUE,
  FILTERED_KEYS_MATCH,
} from '../config.js';

const MATCH_DYNAMIC_PART = 'f_4_0_3_ru-kz_1'; // Динамическая часть URL

/**
 * Сохраняет данные лиги в структурированные данные.
 *
 * @param {Object} structuredData - Структурированные данные.
 * @param {string|null} currentLeague - Текущая лига.
 * @param {Object} leagueData - Данные лиги.
 * @param {Array} matchData - Данные матчей.
 */
const saveLeagueData = (
  structuredData,
  currentLeague,
  leagueData,
  matchData
) => {
  if (currentLeague && isLeagueAllowed(leagueData.ZC)) {
    structuredData[currentLeague] = [{ ...leagueData }, [...matchData]];
  }
};

/**
 * Сохраняет данные лиги или матча.
 *
 * @param {string} key - Ключ данных.
 * @param {string} value - Значение данных.
 * @param {Object} leagueData - Данные лиги.
 * @param {Array} matchData - Данные матчей.
 */
const saveLeagueOrMatchData = (key, value, leagueData, matchData) => {
  const isKeyForLeague = FILTERED_KEYS_LEAGUE[key];
  const isKeyForMatch = FILTERED_KEYS_MATCH[key];

  if (isKeyForLeague) leagueData[key] = value;

  if (isKeyForMatch) {
    if (matchData.length === 0 || key === '~AA') matchData.push({});
    matchData[matchData.length - 1][key] = value;
  }
};

/**
 * Обрабатывает сырые данные и структурирует их по лигам и матчам.
 *
 * @param {Array<string>} data - Сырые данные.
 * @returns {Object} Структурированные данные.
 */
export const processData = (data) => {
  const structuredData = {};
  let currentLeague = null;
  let leagueData = {};
  let matchData = [];

  data.forEach((item) => {
    const [key, value] = item.split('÷');

    if (key.includes('~ZA')) {
      saveLeagueData(structuredData, currentLeague, leagueData, matchData);
      currentLeague = value;
      leagueData = {};
      matchData = [];
    }

    saveLeagueOrMatchData(key, value, leagueData, matchData);
  });

  // Сохраняем данные последней лиги
  saveLeagueData(structuredData, currentLeague, leagueData, matchData);
  return { structuredData };
};

/**
 * Получает данные с API и обрабатывает их.
 *
 * @returns {Promise<Object>} Структурированные данные.
 * @throws {Error} Если запрос к API завершился с ошибкой.
 */
export const fetchAndProcessData = async () => {
  const fullUrl = buildApiUrl(MATCH_DYNAMIC_PART);
  try {
    const startRequestTime = performance.now();
    const response = await axios.get(fullUrl, { headers: HEADERS });
    const endRequestTime = performance.now();
    console.log(
      `Запрос данных занял: ${(endRequestTime - startRequestTime) / 1000} секунд.`
    );

    const data = response.data.split('¬');
    return processData(data);
  } catch (error) {
    console.error(`Ошибка при получении данных: ${error.message}`);
    throw error;
  }
};
