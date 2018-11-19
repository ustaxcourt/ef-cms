const awsDynamoPersistence = require('../../business/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('../../business/src/persistence/docketNumberGenerator');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
  },
  docketNumberGenerator,
  environment: {
    stage: process.env.STAGE || 'local',
  },
};
