module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/frontend/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/__tests__/**/*.test.tsx'],
  globals: {
    'ts-jest': { tsconfig: 'frontend/tsconfig.json' }
  },
};
