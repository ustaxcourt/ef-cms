const client = require('../../dynamodbClientService');

/**
 * verifyPendingCaseForUser
 * @param userId
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.verifyPendingCaseForUser = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  const myCase = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `${userId}|case|pending`,
      ':sk': caseId,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  return myCase && myCase.length > 0;
};
