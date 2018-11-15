const awsDynamoPersistence = require('../../isomorphic/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('../../isomorphic/src/persistence/docketNumberGenerator');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
  },
  docketNumberGenerator,
  environment: {
    stage: process.env.STAGE || 'local',
  },
};
