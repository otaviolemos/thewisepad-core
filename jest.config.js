module.exports = {
  roots: [
    '<rootDir>/test',
    '<rootDir>/src'
  ],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/server.ts', '!<rootDir>/**/ports/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  preset: '@shelf/jest-mongodb',
  setupFiles: ['dotenv/config']
}
