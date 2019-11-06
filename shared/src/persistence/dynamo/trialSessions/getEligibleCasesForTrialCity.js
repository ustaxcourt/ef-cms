const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getEligibleCasesForTrialCity = async ({
  applicationContext,
  procedureType,
  trialCity,
}) => {
  const prefix = `${trialCity}-${procedureType.charAt(0)}`;
  const eligibleCases = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
      ':prefix': prefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  return stripInternalKeys(eligibleCases);
};
