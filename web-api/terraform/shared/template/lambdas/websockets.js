const {
  disconnectLambda,
} = require('../../../src/notifications/disconnectLambda');
const { connectLambda } = require('../../../src/notifications/connectLambda');
const { defaultLambda } = require('../../../src/notifications/defaultLambda');

exports.connectHandler = connectLambda;
exports.disconnectHandler = disconnectLambda;
exports.defaultHandler = defaultLambda;
