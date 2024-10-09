// dataSender.js
import axios from 'axios';

// Асинхронная функция для отправки данных на сервер
export const sendData = async (structuredData) => {
  const apiUrl = process.env.REALTIME_API_URL || 'https://your-realtime-api-url.com/data';

  try {
    const response = await axios.post(apiUrl, structuredData, {
      headers: {
        'Content-Type': 'application/json',
        'x-custom-header': 'your-header-value',
      },
    });

    console.log('Данные успешно отправлены:', response.status);
  } catch (error) {
    console.error('Ошибка при отправке данных:', error.message);
  }
};
