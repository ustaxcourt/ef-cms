const { connectLambda } = require('../../../src/notifications/connectLambda');

const {
  disconnectLambda,
} = require('../../../src/notifications/disconnectLambda');

exports.connectHandler = async event => {
  return connectLambda(event);
};

exports.disconnectHandler = async event => {
  return disconnectLambda(event);
};
