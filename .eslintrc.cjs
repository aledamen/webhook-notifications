module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 12,
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 0,
    'no-console': 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/ban-types': 1,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'import/prefer-default-export': 0,
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreComments: true,
      },
    ],
  },
};
