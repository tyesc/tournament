const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve('../../.test.env') });

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  timers: 'real',
  displayName: 'tournament',
  preset: '@shelf/jest-mongodb',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/tournament',
};
