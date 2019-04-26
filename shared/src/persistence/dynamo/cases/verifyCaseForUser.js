const client = require('../../dynamodbClientService');

exports.verifyCaseForUser = async ({ userId, caseId, applicationContext }) => {
  const myCase = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `${userId}|case`,
      ':sk': caseId,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  if (myCase && myCase.length > 0) {
    return true;
  } else {
    return false;
  }
};
