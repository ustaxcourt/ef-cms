const client = require('../../dynamodbClientService');

exports.updateCaseHearing = async ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}) => {
  return await client.put({
    Item: {
      ...hearingToUpdate,
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
    },
    applicationContext,
  });
};
