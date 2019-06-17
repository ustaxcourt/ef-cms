const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getAssociatedCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'associated-with-trial-case-catalog',
      ':sk': trialSessionId,
    },
    KeyConditionExpression: '#pk = :pk and #sk = :sk',
    applicationContext,
  });

  const ids = mappings.map(metadata => metadata.caseId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: '0',
    })),
  });

  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.pk),
  }));

  return stripInternalKeys(afterMapping);
};
