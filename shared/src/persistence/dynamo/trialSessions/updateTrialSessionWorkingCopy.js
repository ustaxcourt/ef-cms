const client = require('../../dynamodbClientService');

exports.updateTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}) => {
  return await client.put({
    Item: {
      pk: `trial-session-working-copy|${trialSessionWorkingCopyToUpdate.trialSessionId}`,
      sk: `${trialSessionWorkingCopyToUpdate.userId}`,
      ...trialSessionWorkingCopyToUpdate,
    },
    applicationContext,
  });
};
