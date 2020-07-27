const client = require('../../dynamodbClientService');
const { getCaseIdFromDocketNumber } = require('./getCaseIdFromDocketNumber');

exports.associateUserWithCasePending = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return client.put({
    Item: {
      pk: `user|${userId}`,
      sk: `pending-case|${caseId}`,
    },
    applicationContext,
  });
};
