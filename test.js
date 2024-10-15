const rawData = `AC÷1-й период¬IG÷1¬IH÷0¬~III÷tYtV4udR¬IA÷1¬IB÷10:54¬IC÷54¬IE÷3¬INX÷1¬IOX÷0¬IF÷Хоменко Я.¬IU÷/player/khomenko-yan/W6YFGXm1/¬ICT÷¬IK÷Гол¬IM÷W6YFGXm1¬~
AC÷2-й период¬IG÷2¬IH÷1¬~III÷Gvo72aG7¬IA÷2¬IB÷02:55¬IC÷55¬IE÷3¬INX÷1¬IOX÷1¬IF÷Мальцев А.¬IU÷/player/maltsev-artyom/APkDCwNP/¬ICT÷¬IK÷Гол¬IM÷APkDCwNP¬IE÷8¬IF÷Astashevich A.¬IU÷/player/astashevich-anton/UH3GocdC/¬ICT÷¬IK÷Голевой пас¬IM÷UH3GocdC¬IE÷48¬IF÷Карабан Д.¬IU÷/player/karaban-danila/hM6raICD/¬ICT÷¬IK÷Голевая передача 2¬IM÷hM6raICD¬~III÷GzmEObjg¬IA÷1¬IB÷04:52¬IC÷52¬IE÷3¬INX÷2¬IOX÷1¬IF÷Туник В.¬IU÷/player/tunik-vladislav/U3HZE7qS/¬ICT÷¬IK÷Гол¬IM÷U3HZE7qS¬IJ÷1¬IL÷Большинство¬IE÷8¬IF÷Кожевников Е.¬IU÷/player/kozhevnikov-yegor/rTCioCPd/¬ICT÷¬IK÷Голевой пас¬IM÷rTCioCPd¬IE÷48¬IF÷Анисимов Е.¬IU÷/player/anisimov-yegor/dzgZnPUm/¬ICT÷¬IK÷Голевая передача 2¬IM÷dzgZnPUm¬~III÷zBUvylcD¬IA÷1¬IB÷06:23¬IC÷23¬IE÷3¬INX÷3¬IOX÷1¬IF÷Давыдов И.¬IU÷/player/davydov-ilya/MLb3IWZH/¬ICT÷¬IK÷Гол¬IM÷MLb3IWZH¬IE÷8¬IF÷Karamnov V.¬IU÷/player/karamnov-vitali/AksCDVoU/¬ICT÷¬IK÷Голевой пас¬IM÷AksCDVoU¬IE÷48¬IF÷Burdelyov A.¬IU÷/player/burdelyov-artyom/4YuqTtfr/¬ICT÷¬IK÷Голевая передача 2¬IM÷4YuqTtfr¬~
AC÷3-й период¬IG÷2¬IH÷1¬~III÷65D7RwcK¬IA÷2¬IB÷06:29¬IC÷29¬IE÷3¬INX÷3¬IOX÷2¬IF÷Гренц Д.¬IU÷/player/grents-dmitri/CY3JA0LK/¬ICT÷¬IK÷Гол¬IM÷CY3JA0LK¬IE÷8¬IF÷Astashevich A.¬IU÷/player/astashevich-anton/UH3GocdC/¬ICT÷¬IK÷Голевой пас¬IM÷UH3GocdC¬IE÷48¬IF÷Gabrus V.¬IU÷/player/gabrus-vladislav/4jVkHwPf/¬ICT÷¬IK÷Голевая передача 2¬IM÷4jVkHwPf¬~III÷lM8umAzI¬IA÷1¬IB÷14:50¬IC÷50¬IE÷3¬INX÷4¬IOX÷2¬IF÷Тунхузин С.¬IU÷/player/tunkhuzin-stanislav/xjj0Jm9i/¬ICT÷¬IK÷Гол¬IM÷xjj0Jm9i¬IE÷8¬IF÷Mashinets S.¬IU÷/player/mashinets-sergei/A5JF1yvl/¬ICT÷¬IK÷Голевой пас¬IM÷A5JF1yvl¬~III÷GOpW64Rj¬IA÷1¬IB÷15:50¬IC÷50¬IE÷3¬INX÷5¬IOX÷2¬IF÷Туник В.¬IU÷/player/tunik-vladislav/U3HZE7qS/¬ICT÷¬IK÷Гол¬IM÷U3HZE7qS¬IE÷8¬IF÷Анисимов Е.¬IU÷/player/anisimov-yegor/dzgZnPUm/¬ICT÷¬IK÷Голевой пас¬IM÷dzgZnPUm¬IE÷48¬IF÷Кожевников Е.¬IU÷/player/kozhevnikov-yegor/rTCioCPd/¬ICT÷¬IK÷Голевая передача 2¬IM÷rTCioCPd¬~MIT÷VEN¬MIV÷Baluan Sholak Sports Pal
ace¬MIT÷TWN¬MIV÷Алматы¬A1÷¬~`;

// Функция для парсинга данных
function parseData(data) {
  const entries = data.split('~').map((item) => {
    const pairs = item.split('¬').map((pair) => pair.split('÷'));
    const result = {};
    pairs.forEach(([key, value]) => {
      result[key] = value || null; // Если значения нет, установить как null
    });
    return result;
  });
  return entries;
}

// Функция для структурирования данных по игре
function structureMatchData(parsedData) {
  const games = {};

  parsedData.forEach((entry) => {
    const gameId = entry['III']; // Уникальный идентификатор игры

    if (!games[gameId]) {
      games[gameId] = {
        id: gameId,
        events: [],
        players: [],
        time: [],
        stats: [],
      };
    }

    // Добавляем событие
    games[gameId].events.push({
      eventType: entry['IK'], // Тип события (например, Гол)
      player: entry['IF'], // Игрок
      assist1: entry['IM'], // Ассист 1
      assist2: entry['IU'], // Ассист 2 (если есть)
    });

    // Добавляем информацию о времени
    games[gameId].time.push({
      period: entry['IA'], // Период
      time: entry['IB'], // Время в периоде
    });

    // Добавляем статистику
    games[gameId].stats.push({
      code: entry['IC'], // Код события
      otherStat: entry['IE'], // Дополнительная статистика
    });
  });

  return games;
}

// Парсим сырые данные
const parsedData = parseData(rawData);

// Структурируем данные по играм
const structuredGames = structureMatchData(parsedData);
console.log('Структурированные данные по играм:', structuredGames);

// Пример анализа: количество голов в каждой игре
Object.keys(structuredGames).forEach((gameId) => {
  const game = structuredGames[gameId];
  const goals = game.events.filter((event) => event.eventType === 'Гол').length;
  console.log(`Количество голов в игре ${gameId}: ${goals}`);
});
