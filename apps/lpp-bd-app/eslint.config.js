// eslint.config.js
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
    },
  },
];