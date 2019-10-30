require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  connectLambda: require('./notifications/connectLambda').handler,
  disconnectLambda: require('./notifications/disconnectLambda').handler,
};
