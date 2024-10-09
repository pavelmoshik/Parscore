// teamStatsParser.js
import axios from 'axios';
import { HEADERS, buildApiUrl } from '../../config.js';

export const fetchTeamStats = async (dynamicPart) => {
  const fullUrl = buildApiUrl(dynamicPart);
  try {
    const response = await axios.get(fullUrl, { headers: HEADERS });
    return response.data; // Возвращаем данные статистики команды
  } catch (error) {
    console.error(`Ошибка при получении статистики: ${error.message}`);
    throw error;
  }
};
