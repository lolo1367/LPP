// eslint.config.js  (Flat Config)
export default [
  {
    files: ['**/*.js', '**/*.jsx'],          // ← on accepte aussi .jsx
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      // 👉 parser pour comprendre JSX via Babel
      parser: '@babel/eslint-parser',
      parserOptions: { requireConfigFile: false },
    },

    plugins: {
      react: require('eslint-plugin-react'), // ⚛️ plugin React (CommonJS import)
    },

    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',

      // quelques règles React de base (optionnel)
      'react/jsx-uses-react': 'off',        // inutile en React ≥17
      'react/react-in-jsx-scope': 'off',    // idem
    },

    settings: {
      react: { version: 'detect' },         // détecte automatiquement la version
    },
  },
];
