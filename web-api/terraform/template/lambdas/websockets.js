const {
  connectLambda,
} = require('../../../src/lambdas/notifications/connectLambda');
const {
  defaultLambda,
} = require('../../../src/lambdas/notifications/defaultLambda');
const {
  disconnectLambda,
} = require('../../../src/notifications/disconnectLambda');

exports.connectHandler = connectLambda;
exports.disconnectHandler = disconnectLambda;
exports.defaultHandler = defaultLambda;
