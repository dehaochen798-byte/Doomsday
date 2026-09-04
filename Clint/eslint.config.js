import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  {
    // Not linted: build output, deps, generated assets.
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.log'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
    },
  },
  {
    // Node context for config/tooling files.
    files: ['*.{js,ts}', 'vite.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Single-word component names are common for views/pages here.
      'vue/multi-word-component-names': 'off',
      // TypeScript already checks for undefined identifiers, and the core
      // rule does not know about DOM lib types (e.g. ScrollToOptions).
      'no-undef': 'off',
    },
  },
  // Keep ESLint out of formatting; Prettier owns that.
  prettier,
)
