const path = require('path');

const { getJestProjects } = require('@nrwl/jest');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve('.test.env') });

module.exports = {
  projects: getJestProjects(),
};
