import fs from 'fs';

function parseDataToArray(data) {
  const result = [];
  const keysToGroup = new Set([
    'KC',
    'KP',
    'KF',
    'AC',
    'KG',
    'KH',
    'KI',
    'KJ',
    'FH',
    'KK',
    'FK',
    'KL',
    'KU',
    'KT',
    'EC',
    'ED',
    'KM',
    'KX',
    'KY',
    'KN',
    'KS',
  ]);
  const MIN_DATE_THRESHOLD = 1725138000; // Пороговая дата
  const entries = data.split('~'); // Разделяем данные по "~"

  let currentSAObject = null;
  let currentKBKey = null;
  let currentMatchObject = [];

  entries.forEach((entry) => {
    const pairs = entry.split('¬');
    let matchObject = {};

    pairs.forEach((pair) => {
      const [key, value] = pair.split('÷');

      if (key === 'SA') {
        if (currentSAObject) result.push(currentSAObject); // Добавляем текущий SA в результат
        currentSAObject = { SA: value, KB: [] };
      } else if (key === 'KB') {
        if (
          currentMatchObject.length > 0 &&
          !currentSAObject.KB.some((kb) => kb.KB === currentKBKey) &&
          currentSAObject.KB.length < 3
        ) {
          currentSAObject.KB.push({
            KB: currentKBKey,
            matches: currentMatchObject,
          });
        }
        currentKBKey = value;
        currentMatchObject = [];
      } else if (keysToGroup.has(key)) {
        matchObject[key] = value;
      }
    });

    // Добавляем матч только если KC >= пороговому значению
    const matchDate = parseInt(matchObject.KC, 10);
    if (matchDate >= MIN_DATE_THRESHOLD) {
      currentMatchObject.push(matchObject);
    }
  });

  // Добавляем последний KB в SA, если нужно
  if (
    currentMatchObject.length > 0 &&
    currentSAObject &&
    !currentSAObject.KB.some((kb) => kb.KB === currentKBKey) &&
    currentSAObject.KB.length < 3
  ) {
    currentSAObject.KB.push({ KB: currentKBKey, matches: currentMatchObject });
  }

  if (currentSAObject) result.push(currentSAObject);

  return result;
}

// Функция для сохранения результата в файл JSON
function saveResultToJson(result, filename) {
  fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Результат сохранен в ${filename}`);
}

// Пример использования
const data = '';

const result = parseDataToArray(data);
console.log(JSON.stringify(result, null, 2)); // Пример вывода результата
saveResultToJson(result, 'result.json'); // Сохранение результата в JSON-файл
