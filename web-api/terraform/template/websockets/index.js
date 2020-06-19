const { connectLambda } = require('../../../src/notifications/connectLambda');

const {
  disconnectLambda,
} = require('../../../src/notifications/disconnectLambda');

exports.connectHandler = connectLambda;

exports.disconnectHandler = disconnectLambda;
