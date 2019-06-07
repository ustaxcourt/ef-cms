const client = require('../../dynamodbClientService');

exports.updateTrialSession = async ({
  trialSessionToUpdate,
  applicationContext,
}) => {
  await client.put({
    Item: {
      pk: `trial-session-${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session-${trialSessionToUpdate.trialSessionId}`,
      gsi1pk: 'trial-session-catalog',
      ...trialSessionToUpdate,
    },
    applicationContext,
  });
};
