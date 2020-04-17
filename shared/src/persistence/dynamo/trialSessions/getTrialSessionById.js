const client = require('../../dynamodbClientService');

exports.getTrialSessionById = async ({
  applicationContext,
  trialSessionId,
}) => {
  return await client.get({
    Key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
    applicationContext,
  });
};
