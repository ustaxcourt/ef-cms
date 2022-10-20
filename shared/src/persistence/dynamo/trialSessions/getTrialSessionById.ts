const { get } = require('../../dynamodbClientService');

exports.getTrialSessionById = ({ applicationContext, trialSessionId }) =>
  get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });
