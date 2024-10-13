import axios from 'axios';
import { writeFile } from 'fs/promises';

const headers = { 'x-fsign': 'SW9D1eZo' };

async function main() {
  const feed = 'df_hh_1_nHMV3tJ6';
  const url = `https://46.flashscore.ninja/46/x/feed/${feed}`;

  while (true) {
    // Бесконечный цикл для повторения запроса
    const startTime = Date.now();

    try {
      const response = await axios.get(url, { headers });
      const data = response.data.split('¬');

      let fileContent = '';
      for (let i = 0; i < data.length; i++) {
        if (data[i].startsWith('~ZA', '~AA')) {
          fileContent += '\n' + data[i];
        } else {
          fileContent += '¬' + data[i];
        }
      }

      const endTime = Date.now();
      const requestTime = endTime - startTime;

      console.log(`Время запроса: ${requestTime} мс`);

      writeFile('culd.txt', fileContent);
      console.log('Данные сохранены в файл culd.txt');

      // Задержка 0 мс для немедленного повторения запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }
}

main();
