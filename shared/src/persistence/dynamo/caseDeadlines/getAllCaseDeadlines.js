const client = require('../../dynamodbClientService');
const { pick } = require('lodash');

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

  console.log('mappings', mappings);

  // get all case deadlines

  const ids = mappings.map(metadata => metadata.caseDeadlineId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: `case-deadline|${id}`,
      sk: `case-deadline|${id}`,
    })),
  });

  console.log('results', results);
  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.caseDeadlineId),
  }));

  console.log('afterMapping', afterMapping);

  // get the needed cases info data for caseDeadlines

  const caseIds = Object.keys(
    afterMapping.reduce((acc, item) => {
      acc[item.caseId] = true;
      return acc;
    }, {}),
  );
  console.log('caseIds', caseIds);

  const caseResults = await client.batchGet({
    applicationContext,
    keys: caseIds.map(id => ({
      pk: `case|${id}`,
      sk: `case|${id}`,
    })),
  });

  console.log('caseResults', caseResults);

  const caseMap = caseResults.reduce((acc, item) => {
    acc[item.caseId] = item;
    return acc;
  }, {});

  console.log('caseMap', caseMap);

  const afterCaseMapping = afterMapping.map(m => ({
    ...m,
    ...pick(caseMap[m.caseId], [
      'docketNumber',
      'docketNumberSuffix',
      'partyType',
      'contactPrimary',
      'contactSecondary',
    ]),
    associatedJudge: caseMap[m.caseId].associatedJudge,
    caseTitle: caseMap[m.caseId].caseCaption,
  }));

  return afterCaseMapping;
};
