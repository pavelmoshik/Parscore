// parscore.js
import { fetchAndProcessData } from './modules/dataProcessor.js'; // Импорт модуля обработки данных
import { fetchLiveMatchData } from './modules/liveMatchParser.js'; // Импорт модуля лайв-матчей
import { saveToFileAsync } from './fileManager.js'; // Импорт функции сохранения
import { OUTPUT_FILE } from './config.js'; // Импорт переменной для имени файла

async function main() {
  try {
  

    // Получение структурированных данных и идентификаторов матчей
    const { structuredData } = await fetchAndProcessData(); // Запрос и обработка данных для матчей

       // Получение и фильтрация live-матчей
       await fetchLiveMatchData(structuredData);

    //console.log('Структурированные данные матчей:', structuredData);

    await saveToFileAsync(structuredData, OUTPUT_FILE); // Сохранение данных матчей в файл

  } catch (error) {
    console.error(`Ошибка в процессе: ${error.message}`);
  }
}

main();