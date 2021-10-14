module.exports = {
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/server/out', '<rootDir>/client/out'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testRegex: '\\.test\\.ts$',
  preset: 'ts-jest',
  testTimeout: 2000,
}
