const client = require('../../dynamodbClientService');

exports.updateCaseHearing = async ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}) => {
  return await client.put({
    Item: {
      gsi1pk: 'trial-session-catalog',
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
      ...hearingToUpdate,
    },
    applicationContext,
  });
};
