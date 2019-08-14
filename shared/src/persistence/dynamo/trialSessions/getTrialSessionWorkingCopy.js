const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getTrialSessionWorkingCopy = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  return await client
    .get({
      Key: {
        pk: `trial-session-working-copy|${trialSessionId}`,
        sk: `${userId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
