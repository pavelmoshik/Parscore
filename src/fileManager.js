// fileManager.js
import { promises as fs } from 'fs';
import { OUTPUT_FILE } from './config.js';

export const saveToFileAsync = async (data, filename = OUTPUT_FILE) => {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Данные успешно сохранены в файл ${filename}`);
  } catch (error) {
    console.error(`Ошибка при сохранении данных в файл: ${error}`);
  }
};
