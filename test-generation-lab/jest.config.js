/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/services/**/*.ts', 'src/models/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 75,
      statements: 80,
      functions: 80
    }
  },
  testMatch: ['**/tests/**/*.test.ts']
};
