import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier'; // Импорт плагина Prettier

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // Добавьте свои глобальные переменные здесь, если нужно
      },
    },
  },
  {
    ...pluginJs.configs.recommended, // Рекомендуемые настройки ESLint
  },
  {
    plugins: {
      prettier: pluginPrettier, // Подключение плагина Prettier как объект
    },
    rules: {
      semi: ['error', 'always'], // Обязательное использование точки с запятой
      quotes: ['error', 'single'], // Использование одинарных кавычек
      'no-console': 'off', // Предупреждение для console.log
      'prettier/prettier': 'error', // Установка правил форматирования Prettier
    },
  },
];
