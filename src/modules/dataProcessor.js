// dataProcessor.js
import axios from 'axios';
import { HEADERS, buildApiUrl, isLeagueAllowed, FILTERED_KEYS_LEAGUE, FILTERED_KEYS_MATCH } from '../config.js';
const MATCH_DYNAMIC_PART = 'f_4_0_3_ru-kz_1'; // Объявляем динамическую часть как константу

export const processData = (data) => {
  // const startStructuredTime = performance.now(); // Начало отсчета времени парсинга
  
  const structuredData = {};
  let currentLeague = null;
  let leagueData = {};
  let matchData = [];

   // Хранение идентификаторов матчей
  const matchIds = []; 

  data.forEach((item, index) => {
    const [key, value] = item.split('÷');

    if (key.includes('~ZA')) {
      if (currentLeague && isLeagueAllowed(leagueData.ZC)) {
        structuredData[currentLeague] = [{ ...leagueData }, [...matchData]];
      }

      currentLeague = value;
      leagueData = {};
      matchData = [];
    }

    if (FILTERED_KEYS_LEAGUE[key]) {
      leagueData[key] = value;
    }

    if (FILTERED_KEYS_MATCH[key]) {
      if (matchData.length === 0 || key === '~AA') {
        matchData.push({});
      }
      matchData[matchData.length - 1][key] = value;

      // Добавление идентификатора матча в массив
      if (key === '~AA') {
        matchIds.push(value); // Предполагаем, что значение ~AA - это идентификатор матча
      }

    }

    if (
      index === data.length - 1 &&
      currentLeague &&
      isLeagueAllowed(leagueData.ZC)
    ) {
      structuredData[currentLeague] = [{ ...leagueData }, [...matchData]];
    }
  });

  //const endStructuredTime = performance.now(); // Конец отсчета времени парсинга
  //console.log(`Структуризация выполнена за ${((endRequestTime - startRequestTime) / 1000).toFixed(2)} секунд.`);

  return { structuredData, matchIds }; // Возвращаем также идентификаторы матчей
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

