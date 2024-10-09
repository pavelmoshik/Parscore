import axios from 'axios';
import { HEADERS, buildApiUrl, isLeagueAllowed, FILTERED_KEYS_LEAGUE, FILTERED_KEYS_MATCH } from '../config.js';

const MATCH_DYNAMIC_PART = 'f_4_0_3_ru-kz_1'; // Объявляем динамическую часть как константу

export const processData = (data) => {
  const structuredData = {};
  let currentLeague = null;  // Объявляем currentLeague
  let leagueData = {};
  let matchData = [];

  data.forEach((item) => {
    const [key, value] = item.split('÷');

    if (key.includes('~ZA')) {
      if (currentLeague && isLeagueAllowed(leagueData.ZC)) {
        structuredData[currentLeague] = [{ ...leagueData }, [...matchData]];
      }

      // Обновление текущей лиги и сброс данных
      currentLeague = value;
      leagueData = {};
      matchData = [];
    }

    if (FILTERED_KEYS_LEAGUE[key]) {
      leagueData[key] = value;
    }

    if (FILTERED_KEYS_MATCH[key]) {
      // Если массив матчей пустой или это первый элемент, создаем новый объект матча
      if (matchData.length === 0 || key === '~AA') {
        matchData.push({});
      }
      matchData[matchData.length - 1][key] = value;
    }
  });

  // Проверка последней лиги
  if (currentLeague && isLeagueAllowed(leagueData.ZC)) {
    structuredData[currentLeague] = [{ ...leagueData }, [...matchData]];
  }

  return { structuredData }; // Возвращаем структурированные данные
};

// Функция для получения данных с API и их обработки
export const fetchAndProcessData = async () => {
  const fullUrl = buildApiUrl(MATCH_DYNAMIC_PART);
  try {
    const startRequestTime = performance.now(); // Таймер запроса API 
    const response = await axios.get(fullUrl, { headers: HEADERS }); 
    const endRequestTime = performance.now();
    console.log(`Запрос данных занял ${((endRequestTime - startRequestTime) / 1000).toFixed(2)} секунд.`);

    const data = response.data.split('¬'); // Разделение данных на основе '¬'
    return processData(data); // Возвращаем обработанные данные
  } catch (error) {
    console.error(`Ошибка при получении данных: ${error.message}`);
    throw error; // Пробрасываем ошибку выше
  }
};
