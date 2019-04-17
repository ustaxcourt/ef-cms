const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { uniq } = require('lodash');

exports.updateWorkItemsUsingCases = async ({
  applicationContext,
  workItems,
}) => {
  const caseIdsToFetch = uniq(workItems.map(workItem => workItem.caseId));

  const cases = await client.batchGet({
    applicationContext,
    keys: caseIdsToFetch.map(id => ({
      pk: id,
      sk: '0',
    })),
  });

  for (let workItem of workItems) {
    const caseObject = cases.find(c => c.caseId === workItem.caseId);
    if (caseObject) {
      workItem.docketNumber = caseObject.docketNumber;
      workItem.caseStatus = caseObject.status;
    } else {
      console.error(
        'the caseId associated with a workItem was not found',
        JSON.stringify(workItem),
      );
    }
  }

  return stripInternalKeys(workItems);
};
