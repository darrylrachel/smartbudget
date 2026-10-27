import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'public/**'] }, ...tseslint.configs.recommended, { files: ['scripts/*.mjs'], languageOptions: { globals: { Buffer: 'readonly', process: 'readonly' } } });
