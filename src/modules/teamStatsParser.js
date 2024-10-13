import axios from 'axios';
import { HEADERS, buildApiUrl } from '../config.js';

/**
 * Статическая часть URL для командной статистики.
 */
const staticPart = 'df_sui_1_';

/**
 * Проверяет, есть ли данные для обработки.
 *
 * @param {Object} structuredData - Структурированные данные о командах.
 * @returns {boolean} - true, если данные валидны, иначе false.
 */
const validateData = (structuredData) => {
  return structuredData && Object.keys(structuredData).length > 0;
};

/**
 * Извлекает уникальные идентификаторы матчей и значения SA из данных.
 *
 * @param {Object} structuredData - Структурированные данные о командах.
 * @returns {Object} - Объект с массивами уникальных идентификаторов матчей и значений SA.
 */
const getMatchIdsAndSA = (structuredData) => {
  const matchIds = new Set(); // Используем Set для уникальных идентификаторов
  const saValues = [];

  structuredData.H2H.forEach((teamData) => {
    // Извлекаем значение SA
    if (teamData.SA) {
      saValues.push(teamData.SA); // Сохраняем значение SA
    }

    // Извлекаем уникальные идентификаторы матчей
    Object.values(teamData)
      .filter(Array.isArray) // Фильтруем только массивы
      .flatMap((matchGroups) =>
        matchGroups.flatMap(
          (matchGroup) => matchGroup.matches?.map((match) => match.KP) || [] // Получаем массив KP
        )
      )
      .forEach((matchId) => {
        if (matchId) {
          matchIds.add(matchId); // Добавляем в Set
        }
      });
  });

  return { matchIds: Array.from(matchIds), saValues }; // Возвращаем массив уникальных идентификаторов и значения SA
};
/**
 * Создает полный URL для матча.
 *
 * @param {string} matchId - Уникальный идентификатор матча.
 * @returns {string} - Полный URL для матча.
 */
const createMatchUrl = (matchId) => {
  return buildApiUrl(`${staticPart}${matchId}`);
};

/**
 * Запрашивает данные для матча по его URL.
 *
 * @param {string} url - Полный URL для матча.
 * @returns {Promise<Object|null>} - Данные матча или null в случае ошибки.
 */
const fetchMatchData = async (url) => {
  try {
    const response = await axios.get(url, { headers: HEADERS });
    return response.data; // Возвращаем полученные данные
  } catch (error) {
    console.error(`Ошибка при получении данных: ${error.message}`);
    return null;
  }
};

/**
 * Выводит статистику команд.
 *
 * @param {Object} structuredData - Структурированные данные о командах.
 */
export const fetchTeamStats = async (structuredData) => {
  console.log('Запуск функции fetchTeamStats...');

  if (!validateData(structuredData)) {
    console.log('Нет данных для обработки.');
    return;
  }

  // Получаем идентификаторы матчей и значения SA
  const { matchIds, saValues } = getMatchIdsAndSA(structuredData);
  console.log('Полученные значения SA:', saValues.length);
  console.log(`Полученные идентификаторы матчей: ${matchIds.length}`, matchIds);

  // Создаем URL для каждого идентификатора матча
  const fetchPromises = matchIds.map(async (matchId) => {
    const fullUrl = createMatchUrl(matchId); // Создаем полный URL
    //console.log(`Формируемый URL для матча: ${fullUrl}`);
    return await fetchMatchData(fullUrl); // Запрашиваем данные
  });

  // Ожидаем завершения всех запросов
  const results = await Promise.allSettled(fetchPromises);
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      //console.log('Успешно полученные данные:', result.value.substring(0, 10) + '...');
    } else {
      console.error('Ошибка при получении данных:', result.reason);
    }
  });

  // Здесь можно добавить дополнительную логику для анализа статистики
};
