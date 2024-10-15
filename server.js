import { serve } from 'bun';
import fs from 'fs';
import path from 'path';

// Определяем порт
const PORT = 3000;

// Путь к файлу .env
const envFilePath = path.join(process.cwd(), '.env');

// Функция для чтения .env файла
const readEnvFile = () => {
  const data = fs.readFileSync(envFilePath, 'utf-8');
  const lines = data.split('\n');
  const envObject = {};
  lines.forEach((line) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      envObject[key.trim()] = value.trim();
    }
  });
  return envObject;
};

// Функция для обновления значений в .env файле
const updateEnvFile = (newValues) => {
  const data = fs.readFileSync(envFilePath, 'utf-8');
  const updatedData = data
    .split('\n')
    .map((line) => {
      const [key] = line.split('=');
      if (newValues[key.trim()]) {
        return `${key}=${JSON.stringify(newValues[key.trim()])}`;
      }
      return line;
    })
    .join('\n');
  fs.writeFileSync(envFilePath, updatedData);
};

// Создание сервера
serve({
  port: PORT,
  fetch(request) {
    const url = new URL(request.url);

    // Обслуживание корневого URL (/) - отправка index.html
    if (url.pathname === '/') {
      const filePath = path.join(process.cwd(), 'public', 'index.html');
      try {
        const fileContent = fs.readFileSync(filePath);
        return new Response(fileContent, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch (err) {
        console.error(err);
        return new Response('Not Found', { status: 404 });
      }
    }

    // Обслуживание статических файлов в папке public
    if (url.pathname.startsWith('/public/')) {
      const filePath = path.join(process.cwd(), url.pathname);
      try {
        const fileContent = fs.readFileSync(filePath);
        const ext = path.extname(filePath).slice(1); // Получаем расширение файла
        const contentType =
          ext === 'html' ? 'text/html' : 'application/javascript'; // Задаем тип содержимого
        return new Response(fileContent, {
          headers: { 'Content-Type': contentType },
        });
      } catch (err) {
        console.error(err);
        return new Response('Not Found', { status: 404 });
      }
    }

    // API для получения .env значений
    if (request.method === 'GET' && url.pathname === '/api/env') {
      const env = readEnvFile();
      return new Response(JSON.stringify(env), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // API для обновления значений
    if (request.method === 'POST' && url.pathname === '/api/env') {
      return request.json().then((body) => {
        const newValues = {
          ALLOWED_LEAGUE_COLLECTOR_KEYS: JSON.parse(
            body.ALLOWED_LEAGUE_COLLECTOR_KEYS
          ),
          FILTERED_KEYS_LEAGUE: JSON.parse(body.FILTERED_KEYS_LEAGUE),
          FILTERED_KEYS_MATCH: JSON.parse(body.FILTERED_KEYS_MATCH),
          ALLOWED_LEAGUE_KEYS: JSON.parse(body.ALLOWED_LEAGUE_KEYS),
          ALLOWED_LIVE_LEAGUE_KEYS: JSON.parse(body.ALLOWED_LIVE_LEAGUE_KEYS),
        };
        updateEnvFile(newValues);
        return new Response(JSON.stringify({ message: 'Файл .env обновлен' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

// Запуск сервера
console.log(`Сервер запущен на http://localhost:${PORT}`);
