const {
  connectLambda,
} = require('../../../src/lambdas/notifications/connectLambda');
const {
  defaultLambda,
} = require('../../../src/lambdas/notifications/defaultLambda');
const {
  disconnectLambda,
} = require('../../../src/lambdas/notifications/disconnectLambda');

exports.connectHandler = connectLambda;
exports.disconnectHandler = disconnectLambda;
exports.defaultHandler = defaultLambda;
