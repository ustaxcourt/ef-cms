const awsDynamoPersistence = require('../../isomorphic/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('./cases/middleware/docketNumberGenerator');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
  },
  docketNumberGenerator,
  environment: {
    stage: process.env.STAGE,
  },
};
