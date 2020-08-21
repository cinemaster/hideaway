module.exports = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**', '!src/index.ts'],
  modulePathIgnorePatterns: ['__ignore_test__'],
  testMatch: ['<rootDir>/test/*.ts'],
  coverageThreshold: {
    global: {
      branches: 99.53,
      functions: 100,
      lines: 100,
    },
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
