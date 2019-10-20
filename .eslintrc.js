module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'flowtype',
    '@typescript-eslint'
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
  },
};
