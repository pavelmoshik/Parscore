// src/parscore.js

import { fetchAndProcessData } from './modules/dataProcessor.js';
import { fetchAllMatchData } from './modules/teamInfoCollector.js';
import { fetchTeamStats } from './modules/teamStatsParser.js';
// import { fetchLiveMatchData } from './modules/liveMatchParser.js';
import { saveToFileAsync } from './fileManager.js';
import { OUTPUT_FILE } from './config.js';

/**
 * Основная функция для выполнения всех задач проекта.
 */
async function main() {
  console.log("Запуск приложения Parscore...");

  try {
    // Получение и обработка данных
    const { structuredData } = await fetchAndProcessData();
    await saveToFileAsync(structuredData, OUTPUT_FILE);
    console.log("Структурированные данные сохранены.");

    // Получение данных матчей и передача в fetchTeamStats
    const teamData = await fetchAllMatchData(structuredData);
    if (teamData) {
      await fetchTeamStats(teamData);
    }

    // Получение и фильтрация live-матчей (опционально)
    // await fetchLiveMatchData(structuredData);

    console.log("Приложение завершило работу успешно.");
  } catch (error) {
    console.error(`Ошибка в процессе: ${error.message}`);
  }
}

main();
