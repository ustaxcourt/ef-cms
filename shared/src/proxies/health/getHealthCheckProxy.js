const { get } = require('../requests');

/**
 * getHealthCheckInteractor
 *
 * fixme
 */
exports.getHealthCheckInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/health',
  });
};
