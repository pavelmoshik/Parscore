// config.js
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения из файла .env

const BASE_URL = process.env.API_BASE_URL || 'https://46.flashscore.ninja/46/x/feed/';
const HEADERS = { 'x-fsign': process.env.API_FSIGN || 'defaultKey' };  
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'default.json';

const ALLOWED_LEAGUE_KEYS = JSON.parse(process.env.ALLOWED_LEAGUE_KEYS);   // Фильтр лиг
const FILTERED_KEYS_LEAGUE = JSON.parse(process.env.FILTERED_KEYS_LEAGUE); // Фильтр ключей лиги
const FILTERED_KEYS_MATCH = JSON.parse(process.env.FILTERED_KEYS_MATCH);   // Фильтр ключей матча


// Функция для создания полного URL на основе динамичной части
const buildApiUrl = (dynamicPart) => {
  return `${BASE_URL}${dynamicPart}`;
};

const isLeagueAllowed = (leagueId) => ALLOWED_LEAGUE_KEYS[leagueId] === true;

const REALTIME_API_URL = process.env.REALTIME_API_URL || 'https://your-realtime-api-url.com/data'; // API ссылка

export {

  HEADERS,
  OUTPUT_FILE,
  FILTERED_KEYS_LEAGUE,
  FILTERED_KEYS_MATCH,
  REALTIME_API_URL,      // API экспорт
  isLeagueAllowed,
  buildApiUrl,           // Динамическая ссылка

};
