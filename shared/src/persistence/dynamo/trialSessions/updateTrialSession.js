const { put } = require('../../dynamodbClientService');

exports.updateTrialSession = ({ applicationContext, trialSessionToUpdate }) =>
  put({
    Item: {
      ...trialSessionToUpdate,
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session|${trialSessionToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
