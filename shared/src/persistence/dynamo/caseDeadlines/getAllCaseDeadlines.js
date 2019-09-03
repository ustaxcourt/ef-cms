const client = require('../../dynamodbClientService');
const { pick } = require('lodash');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getAllCaseDeadlines = async ({ applicationContext }) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'case-deadline-catalog',
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  // get all case deadlines

  const ids = mappings.map(metadata => metadata.caseDeadlineId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.pk),
  }));

  // get the needed cases info data for caseDeadlines

  const caseIds = Object.keys(
    afterMapping.reduce((acc, item) => {
      acc[item.caseId] = true;
      return acc;
    }, {}),
  );

  const caseResults = await client.batchGet({
    applicationContext,
    keys: caseIds.map(id => ({
      pk: id,
      sk: '0',
    })),
  });

  const caseMap = caseResults.reduce((acc, item) => {
    acc[item.caseId] = item;
    return acc;
  }, {});

  const afterCaseMapping = afterMapping.map(m => ({
    ...m,
    ...pick(caseMap[m.caseId], ['docketNumber', 'docketNumberSuffix']),
  }));

  return stripInternalKeys(afterCaseMapping);
};
