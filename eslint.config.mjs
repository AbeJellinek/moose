// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    react.configs.flat.recommended,
    reactHooks.configs['recommended-latest'],
    {
        rules: {
            'object-curly-spacing': ['error', 'always'],
            'quotes': ['error', 'single'],
            'prefer-const': 'off',
            'no-prototype-builtins': 'off'
        }
    }
);
