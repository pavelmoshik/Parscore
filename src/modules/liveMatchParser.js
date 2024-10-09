// liveMatchParser.js
import axios from 'axios';
import { HEADERS, buildApiUrl } from '../config.js';

export const fetchLiveMatchData = async (matchId) => {
  const staticPart = 'df_st_1_';
  const dynamicPart = matchId; // Динамическая часть, полученная из dataProcessor.js
  const fullUrl = buildApiUrl(staticPart + dynamicPart); // Формируем полный URL

  try {
    const response = await axios.get(fullUrl, { headers: HEADERS });
    return response.data; // Возвращаем данные о лайв-матчах
  } catch (error) {
    console.error(`Ошибка при получении лайв-матчей: ${error.message}`);
    throw error;
  }
};
