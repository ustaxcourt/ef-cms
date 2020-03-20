module.exports = {
  connectLambda: require('./notifications/connectLambda').connectLambda,
  disconnectLambda: require('./notifications/disconnectLambda')
    .disconnectLambda,
};
