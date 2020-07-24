const client = require('../../dynamodbClientService');
const { getCaseIdFromDocketNumber } = require('./getCaseIdFromDocketNumber');

exports.verifyCaseForUser = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber,
  });

  const myCase = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':sk': `case|${caseId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  return myCase && myCase.length > 0;
};
