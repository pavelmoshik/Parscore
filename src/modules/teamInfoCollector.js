import axios from 'axios';
import { HEADERS, buildApiUrl } from '../config.js';

export const fetchAllMatchData = async (structuredData) => {
  const staticPart = 'df_hh_1_'; // Обновлено значение staticPart

  // Получаем идентификаторы всех матчей в отфильтрованных данных
  const allMatchIds = Object.entries(structuredData)
    .flatMap(([leagueId, [leagueInfo, matches]]) => matches.map(match => match['~AA'])); // Собираем идентификаторы всех матчей

  if (!allMatchIds.length) {
    console.log("Нет матчей в отфильтрованных данных.");
    return;
  }

  console.log("Идентификаторы всех матчей:", allMatchIds);

  for (const matchId of allMatchIds) {
    const fullUrl = buildApiUrl(staticPart + matchId);

    console.log(`Формируемый URL: ${fullUrl}`);

    try {
      const response = await axios.get(fullUrl, { headers: HEADERS });
      console.log(`Данные для матча '${matchId}' получены:`, response.data); // Показываем полученные данные

      // Структурируем и выводим данные
      const structuredMatchData = structureMatchData(response.data, matchId);
      console.log(`Данные для матча ${matchId} структурированы:`, structuredMatchData); // Показываем структурированные данные

    } catch (error) {
      console.error(`Ошибка при получении данных для матча ${matchId}: ${error.message}`);
    }
  }
};

// Пример функции структурирования данных матча
const structureMatchData = (data, matchId) => {
  // Структурирование данных матча (можно добавить дополнительную обработку)
  return {
    matchId,
    details: data, // Сюда можно добавить логику по извлечению нужных полей из data
  };
};


