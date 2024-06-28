module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'simple-import-sort'
  ],
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
