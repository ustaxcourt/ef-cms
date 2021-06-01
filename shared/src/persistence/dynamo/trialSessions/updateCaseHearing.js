const client = require('../../dynamodbClientService');

exports.updateCaseHearing = async ({
  applicationContext,
  docketNumber,
  hearingToUpdate,
}) => {
  return await client.put({
    Item: {
      pk: `case|${docketNumber}`,
      sk: `hearing|${hearingToUpdate.trialSessionId}`,
      ...hearingToUpdate,
    },
    applicationContext,
  });
};
