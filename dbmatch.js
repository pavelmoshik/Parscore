import axios from 'axios';
import { writeFile } from 'fs/promises';

const headers = { "x-fsign": "SW9D1eZo" };

async function main() {
  const feed = "df_sui_1_zw3QPNuQ";
  const url = `https://46.flashscore.ninja/46/x/feed/${feed}`;

  
    const startTime = Date.now();

    try {
      const response = await axios.get(url, { headers });
      const data = response.data.split("¬");

      let fileContent = "";
      for (let i = 0; i < data.length; i++) {
        if (data[i].startsWith("~ZA", "~AA")) {
          fileContent += "\n" + data[i]; 
        } else {
          fileContent += "¬" + data[i]; 
        }
      }

      const endTime = Date.now();
      const requestTime = endTime - startTime;

      console.log(`Время запроса: ${requestTime} мс`);

      writeFile("dbmatch.txt", fileContent);
      console.log("Данные сохранены в файл dbmatch.txt");


    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  
}

main();


