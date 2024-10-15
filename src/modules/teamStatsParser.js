import axios from 'axios';
import fs from 'fs'; // Подключаем модуль для работы с файлами
import { HEADERS, buildApiUrl } from '../config.js';

const staticPart = 'df_sui_1_';

// Функции для валидации и обработки данных
const validateData = (structuredData) => {
  console.log('Входные данные для validateData:', structuredData);
  return structuredData && Object.keys(structuredData).length > 0;
};

const getUniqueKeysAndMatchData = (structuredData) => {
  console.log('Входные данные для getUniqueKeysAndMatchData:', structuredData);

  const uniqueKeys = new Set();
  const matchDataMap = {};

  structuredData.H2H.forEach((teamData) => {
    Object.keys(teamData).forEach((key) => {
      if (Array.isArray(teamData[key])) {
        uniqueKeys.add(key);
        matchDataMap[key] = matchDataMap[key] || [];
        matchDataMap[key].push(teamData);
      }
    });
  });

  console.log('Уникальные ключи:', Array.from(uniqueKeys));
  return { uniqueKeys: Array.from(uniqueKeys), matchDataMap };
};

// Функции для работы с URL и данными
const createMatchUrl = (matchId) => {
  const url = buildApiUrl(`${staticPart}${matchId}`);
  console.log(`Созданный URL для матча ${matchId}:`, url);
  return url;
};

const fetchMatchData = async (url) => {
  console.log('Запрос данных по URL:', url);
  try {
    const response = await axios.get(url, { headers: HEADERS });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении данных: ${error.message}`);
    return null;
  }
};

const saveDataToFile = (data, fileName) => {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 4), 'utf8');
  console.log(`Данные сохранены в файл: ${fileName}`);
};

// Обновленная функция парсинга для извлечения только нужных ключей
const parseData = (data) => {
  const entries = data.split('~').map((item) => {
    const pairs = item.split('¬').map((pair) => pair.split('÷'));
    const result = {};
    pairs.forEach(([key, value]) => {
      // Сохраняем только нужные ключи
      if (["AC", "IG", "IH"].includes(key)) {
        result[key] = value || null;
      }
    });
    return result;
  });
  
  // Фильтруем пустые результаты
  return entries.filter(entry => Object.keys(entry).length > 0);
};

// Функция для подсчета количества матчей и matchId для каждого уникального ключа
const countMatches = (finalMatchDataMap) => {
  const results = {};

  for (const key in finalMatchDataMap) {
    const matchIds = finalMatchDataMap[key];
    const resultEntry = { matches: 0, countMoreThan1: 0, countMoreThan2: 0 }; // Инициализируем счетчики

    resultEntry.matches = Object.keys(matchIds).length; // Общее количество матчей

    for (const matchId in matchIds) {
      const matchDataArray = matchIds[matchId];

      // Проверяем, является ли matchDataArray массивом и не пустым
      if (Array.isArray(matchDataArray) && matchDataArray.length > 0) {
        const firstMatchData = matchDataArray[0];
        const igValue = parseInt(firstMatchData.IG, 10) || 0;
        const ihValue = parseInt(firstMatchData.IH, 10) || 0;

        const sum = igValue + ihValue;

        // Увеличиваем счетчики в зависимости от суммы
        if (sum > 1) resultEntry.countMoreThan1++;
        if (sum > 2) resultEntry.countMoreThan2++;
      }
    }

    results[key] = resultEntry; // Сохраняем результаты для уникального ключа
  }

  return results;
};

// Основная функция для получения статистики команд
export const fetchTeamStats = async (structuredData) => {
  console.log('Запуск функции fetchTeamStats с входными данными:', structuredData);

  if (!validateData(structuredData)) {
    console.log('Нет данных для обработки.');
    return;
  }

  const { uniqueKeys, matchDataMap } = getUniqueKeysAndMatchData(structuredData);
  const finalMatchDataMap = {};

  for (const key of uniqueKeys) {
    console.log(`Обработка уникального ключа: ${key}`);

    const matchIdsForGroup = new Set();
    matchDataMap[key].forEach((teamData) => {
      teamData[key]?.forEach((matchGroup) => {
        matchGroup.matches?.forEach((match) => {
          if (match.KP) matchIdsForGroup.add(match.KP);
        });
      });
    });

    const matchDataGroupMap = {};
    await Promise.all(
      Array.from(matchIdsForGroup).map(async (matchId) => {
        const matchData = await fetchMatchData(createMatchUrl(matchId));
        if (matchData) {
          console.log(`Обработка данных матча ${matchId} для ключа: ${key}`);
          const parsedData = parseData(matchData);
          matchDataGroupMap[matchId] = parsedData.length ? parsedData : [];
        }
      })
    );

    finalMatchDataMap[key] = matchDataGroupMap;
  }

  const matchCounts = countMatches(finalMatchDataMap);
  saveDataToFile(matchCounts, 'match_counts.json');
  console.log('Подсчитанные данные сохранены.');
};
