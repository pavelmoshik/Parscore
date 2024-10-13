// src/modules/dataStructurizer.js

/**
 * Парсит сырые данные в структуру.
 *
 * @param {string} data - Сырые данные.
 * @param {Array<Object>} matchIds - Массив объектов с matchId и leagueZC.
 * @returns {Object} Структурированные данные.
 */
export function parseDataToArray(data, matchIds) {
    const result = { H2H: [] };
    const keysToGroup = new Set(['KC', 'KP', 'KF', 'AC', 'KG', 'KH', 'KI', 'KJ', 'FH', 'KK', 'FK', 'KL', 'KU', 'KT', 'EC', 'ED', 'KN', 'KS']);
    const MIN_DATE_THRESHOLD = 1725138000; // Пороговая дата
    const entries = data.split('~');
  
    let currentSAObject = null;
    let currentKBKey = null;
    let currentMatchObject = [];
  
    entries.forEach(entry => {
      const pairs = entry.split('¬');
      let matchObject = {};
  
      pairs.forEach(pair => {
        const [key, value] = pair.split('÷');
  
        if (key === 'SA') {
          if (currentSAObject) {
            result.H2H.push(currentSAObject);
          }
  
          const matchIdInfo = matchIds.shift();
          if (matchIdInfo) {
            const uniqueMatchId = matchIdInfo.matchId;
            const leagueZC = matchIdInfo.leagueZC;
  
            currentSAObject = {
              SA: value,
              ZC: leagueZC,
              [uniqueMatchId]: []
            };
            currentKBKey = null;
            currentMatchObject = [];
          } else {
            console.error("Ошибка: нет доступных идентификаторов матчей.");
          }
        } else if (key === 'KB') {
          const currentMatchesArray = currentSAObject && currentSAObject[Object.keys(currentSAObject)[2]];
  
          if (currentMatchObject.length > 0 && currentSAObject &&
            currentMatchesArray &&
            !currentMatchesArray.some(arr => arr.KB === currentKBKey) &&
            currentMatchesArray.length < 3) {
            currentMatchesArray.push({ KB: currentKBKey, matches: currentMatchObject });
          }
          currentKBKey = value;
          currentMatchObject = [];
        } else if (keysToGroup.has(key)) {
          matchObject[key] = value;
        }
      });
  
      const matchDate = parseInt(matchObject.KC, 10);
      if (!isNaN(matchDate) && matchDate >= MIN_DATE_THRESHOLD) {
        currentMatchObject.push(matchObject);
      }
    });
  
    // Добавляем последний KB в SA, если нужно
    const currentMatchesArray = currentSAObject && currentSAObject[Object.keys(currentSAObject)[2]];
    if (currentMatchObject.length > 0 && currentSAObject &&
      currentMatchesArray &&
      !currentMatchesArray.some(arr => arr.KB === currentKBKey) &&
      currentMatchesArray.length < 3) {
      currentMatchesArray.push({ KB: currentKBKey, matches: currentMatchObject });
    }
  
    if (currentSAObject) result.H2H.push(currentSAObject);
  
    return result;
  }
  