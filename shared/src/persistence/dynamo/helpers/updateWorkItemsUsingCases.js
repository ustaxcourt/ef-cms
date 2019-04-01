const { getCaseByCaseId } = require('../../dynamo/cases/getCaseByCaseId');
const { uniq } = require('lodash');
const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

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
    workItem.docketNumber = caseObject.docketNumber;
    workItem.caseStatus = caseObject.status;
  }

  return stripInternalKeys(workItems);
};
