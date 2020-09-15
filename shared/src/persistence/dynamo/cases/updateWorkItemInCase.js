const client = require('../../dynamodbClientService');

exports.updateWorkItemInCase = async ({
  applicationContext,
  caseToUpdate,
  workItem,
}) => {
  let docketEntryId = null;
  caseToUpdate.docketEntries.forEach(document => {
    if (
      document.workItem &&
      document.workItem.workItemId === workItem.workItemId
    ) {
      ({ docketEntryId } = document);
    }
  });

  await client.update({
    ExpressionAttributeNames: {
      '#workItem': 'workItem',
    },
    ExpressionAttributeValues: {
      ':workItem': workItem,
    },
    Key: {
      pk: `case|${caseToUpdate.docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
    UpdateExpression: 'SET #workItem = :workItem',
    applicationContext,
  });
};
