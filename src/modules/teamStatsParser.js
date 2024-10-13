// src/modules/teamStatsParser.js

import { fetchAllMatchData } from './teamInfoCollector.js';

/**
 * Выводит статистику команд.
 *
 * @param {Object} structuredData - Структурированные данные о командах.
 */
export const fetchTeamStats = async (structuredData) => {
  console.log("Запуск функции fetchTeamStats...");

  if (!structuredData || Object.keys(structuredData).length === 0) {
    console.log("Нет данных для обработки.");
    return;
  }

  // Пример дальнейшей обработки: вывод статистики
  console.log('Полученные сортированные данные:', JSON.stringify(structuredData, null, 2));

  // Здесь можно добавить дополнительную логику для анализа статистики
};
