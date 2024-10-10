import axios from 'axios';
import { HEADERS, buildApiUrl, isLiveLeagueAllowed } from '../config.js';

export const fetchLiveMatchData = async (structuredData) => {
  const staticPart = 'df_st_1_';

  // Фильтрация матчей и получение только идентификаторов
  const filteredMatchIds = Object.entries(structuredData)
    .flatMap(([_, [leagueInfo, matches]]) =>
      isLiveLeagueAllowed(leagueInfo['ZC']) ? matches.filter(match => match['AB'] === '2').map(match => match['~AA']) : []
    );

  if (!filteredMatchIds.length) {
    console.log("Нет матчей, соответствующих критериям фильтрации.");
    return;
  }

  console.log("Отфильтрованные идентификаторы матчей:", filteredMatchIds);

  for (const matchId of filteredMatchIds) {
    const fullUrl = buildApiUrl(staticPart + matchId);

    console.log(`Формируемый URL: ${fullUrl}`);

    try {
      const response = await axios.get(fullUrl, { headers: HEADERS });
      console.log(`Данные для матча '${matchId}' получены.`);

      // Структурируем и выводим данные
      const structuredMatchData = structureMatchData(response.data, matchId);
      console.log(`Данные для матча ${matchId} структурированны.`);

    } catch (error) {
      console.error(`Ошибка при получении лайв-матчей для ${matchId}: ${error.message}`);
    }
  }
};

// Функция для структурирования данных матча с добавлением идентификатора матча
const structureMatchData = (data, matchId) => {
  const sections = data.split('¬~SE÷').slice(1); // Разделяем по секциям

  return {
    [matchId]: sections.reduce((acc, section, index) => {
      const sectionKey = `SE_${index + 1}`;
      const stats = section.split('¬~SG÷').slice(1).map(stat => (
        Object.fromEntries(stat.split('¬').map(entry => entry.split('÷')))
      ));
      acc[sectionKey] = { SG: stats };
      return acc;
    }, {})
  };
};
