module.exports = {
  verbose: true,
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/__ignore_tests__/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/__ignore_test__/**'],
};
