/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/services/**/*.ts', 'src/models/**/*.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};
