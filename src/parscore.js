// parscore.js
import { fetchAndProcessData } from './modules/dataProcessor.js'; // Импорт модуля обработки данных
import { fetchLiveMatchData } from './modules/liveMatchParser.js'; // Импорт модуля лайв-матчей
import { saveToFileAsync } from './fileManager.js'; // Импорт функции сохранения
import { OUTPUT_FILE } from './config.js'; // Импорт переменной для имени файла

async function main() {
  try {
  

    // Получение структурированных данных и идентификаторов матчей
    const { structuredData, matchIds } = await fetchAndProcessData(); // Запрос и обработка данных для матчей

    //console.log('Структурированные данные матчей:', structuredData);

    // Если есть идентификаторы матчей, получить данные для лайв-матчей
    for (const matchId of matchIds) {
      const liveMatchData = await fetchLiveMatchData(matchId); // Получение лайв-матчей для каждого идентификатора
      console.log(`Данные лайв-матча для ${matchId}:`, liveMatchData);
    }
    
    await saveToFileAsync(structuredData, OUTPUT_FILE); // Сохранение данных матчей в файл

  } catch (error) {
    console.error(`Ошибка в процессе: ${error.message}`);
  }
}

main();