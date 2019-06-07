const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getTrialSessionById = ({ trialSessionId, applicationContext }) => {
  return client
    .get({
      Key: {
        pk: `trial-session-${trialSessionId}`,
        sk: `trial-session-${trialSessionId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
