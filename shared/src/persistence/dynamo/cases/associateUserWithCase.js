const client = require('../../dynamodbClientService');
const { getCaseIdFromDocketNumber } = require('./getCaseIdFromDocketNumber');

exports.associateUserWithCase = async ({
  applicationContext,
  docketNumber,
  userCase,
  userId,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  return client.put({
    Item: {
      ...userCase,
      gsi1pk: `user-case|${caseId}`,
      pk: `user|${userId}`,
      sk: `case|${caseId}`,
    },
    applicationContext,
  });
};
