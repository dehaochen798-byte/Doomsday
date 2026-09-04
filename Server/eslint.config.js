const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const prettier = require('eslint-config-prettier')
const globals = require('globals')

module.exports = tseslint.config(
  {
    // Not linted: build output and deps.
    ignores: ['dist/**', 'node_modules/**', '*.log'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // This is a CommonJS project; config/tooling files use require().
    files: ['eslint.config.js', '*.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Keep ESLint out of formatting; Prettier owns that.
  prettier,
)
