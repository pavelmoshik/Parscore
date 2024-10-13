/* eslint-disable no-undef */
// config.js

import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения из файла .env

/**
 * Функция безопасного парсинга JSON.
 *
 * @param {string} jsonString - Строка в формате JSON.
 * @param {any} defaultValue - Значение по умолчанию в случае ошибки парсинга.
 * @returns {any} Результат парсинга или значение по умолчанию.
 */
const safeJsonParse = (jsonString, defaultValue = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Ошибка парсинга JSON: ${error.message}`);
    return defaultValue;
  }
};

const BASE_URL =
  process.env.API_BASE_URL || 'https://46.flashscore.ninja/46/x/feed/';
const HEADERS = { 'x-fsign': process.env.API_FSIGN || 'defaultKey' };
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'hockeymatches.json';
const TEAM_COLLECTOR_OUTPUT_FILE =
  process.env.TEAM_COLLECTOR_OUTPUT_FILE || 'teamMatchesData.json';

const ALLOWED_LEAGUE_KEYS = safeJsonParse(process.env.ALLOWED_LEAGUE_KEYS, {});
const ALLOWED_LIVE_LEAGUE_KEYS = safeJsonParse(
  process.env.ALLOWED_LIVE_LEAGUE_KEYS,
  {}
);
const ALLOWED_LEAGUE_COLLECTOR_KEYS = safeJsonParse(
  process.env.ALLOWED_LEAGUE_COLLECTOR_KEYS,
  {}
);

const FILTERED_KEYS_LEAGUE = safeJsonParse(
  process.env.FILTERED_KEYS_LEAGUE,
  {}
);
const FILTERED_KEYS_MATCH = safeJsonParse(process.env.FILTERED_KEYS_MATCH, {});

/**
 * Создает полный URL на основе динамической части.
 *
 * @param {string} dynamicPart - Динамическая часть URL.
 * @returns {string} Полный URL.
 */
const buildApiUrl = (dynamicPart) => `${BASE_URL}${dynamicPart}`;

/**
 * Проверяет, разрешена ли лига.
 *
 * @param {string} leagueId - Идентификатор лиги.
 * @returns {boolean} Разрешена ли лига.
 */
const isLeagueAllowed = (leagueId) => ALLOWED_LEAGUE_KEYS[leagueId] === true;

/**
 * Проверяет, разрешена ли лига для лайв-матчей.
 *
 * @param {string} leagueId - Идентификатор лиги.
 * @returns {boolean} Разрешена ли лига для лайв-матчей.
 */
const isLiveLeagueAllowed = (leagueId) =>
  ALLOWED_LIVE_LEAGUE_KEYS[leagueId] === true;

/**
 * Проверяет, разрешена ли лига для коллектора.
 *
 * @param {string} leagueId - Идентификатор лиги.
 * @returns {boolean} Разрешена ли лига для коллектора.
 */
const isCollectorLeagueAllowed = (leagueId) =>
  ALLOWED_LEAGUE_COLLECTOR_KEYS[leagueId] === true;

const REALTIME_API_URL =
  process.env.REALTIME_API_URL || 'https://your-realtime-api-url.com/data';

export {
  HEADERS,
  OUTPUT_FILE,
  TEAM_COLLECTOR_OUTPUT_FILE,
  FILTERED_KEYS_LEAGUE,
  FILTERED_KEYS_MATCH,
  REALTIME_API_URL,
  isLeagueAllowed,
  isLiveLeagueAllowed,
  isCollectorLeagueAllowed,
  buildApiUrl,
  ALLOWED_LEAGUE_KEYS,
  ALLOWED_LIVE_LEAGUE_KEYS,
  ALLOWED_LEAGUE_COLLECTOR_KEYS,
};
