import axios from 'axios';
import { HEADERS, buildApiUrl, isLiveLeagueAllowed } from '../config.js';

export const fetchLiveMatchData = async (structuredData) => {
  const staticPart = 'df_st_1_';

  // Извлекаем матчи из переданных данных и фильтруем их
  const filteredMatches = Object.entries(structuredData)
    .flatMap(([leagueName, [leagueInfo, matches]]) => 
      isLiveLeagueAllowed(leagueInfo['ZC']) ? matches.filter(match => match['AB'] === '2') : []
    );

  // Проверяем, есть ли отфильтрованные матчи
  if (filteredMatches.length === 0) {
    console.log("Нет матчей, соответствующих критериям фильтрации.");
    return; // Выходим из функции, если матчей нет
  }

  console.log("Отфильтрованные матчи:", filteredMatches);

  // Перебираем отфильтрованные матчи
  for (const match of filteredMatches) {
    const dynamicPart = match['~AA']; // Используем ID матча
    const fullUrl = buildApiUrl(staticPart + dynamicPart);
    
    // Проверка формируемого URL
    console.log(`Формируемый URL: ${fullUrl}`);

    try {
      const response = await axios.get(fullUrl, { headers: HEADERS });
      console.log(`Данные для матча ${dynamicPart}:`, response.data);
    } catch (error) {
      console.error(`Ошибка при получении лайв-матчей для ${dynamicPart}: ${error.message}`);
    }
  }
};

