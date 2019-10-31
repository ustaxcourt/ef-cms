module.exports = {
  connectLambda: require('./notifications/connectLambda').handler,
  disconnectLambda: require('./notifications/disconnectLambda').handler,
};
