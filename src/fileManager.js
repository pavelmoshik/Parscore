// src/modules/fileManager.js
// src/fileManager.js

import { promises as fs } from 'fs';

/**
 * Асинхронно сохраняет данные в файл.
 *
 * @param {any} data - Данные для сохранения.
 * @param {string} filename - Имя файла.
 * @param {Object} [options] - Дополнительные опции для записи файла.
 * @throws {Error} Если имя файла не указано или произошла ошибка при записи.
 */
export const saveToFileAsync = async (
  data,
  filename,
  options = { encoding: 'utf-8' }
) => {
  if (!filename) {
    throw new Error('Имя файла не указано.');
  }

  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filename, jsonData, options);
    console.log(`Данные успешно сохранены в файл ${filename}`);
  } catch (error) {
    console.error(
      `Ошибка при сохранении данных в файл ${filename}: ${error.message}`
    );
    throw error;
  }
};
