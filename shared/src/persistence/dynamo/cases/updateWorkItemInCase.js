const client = require('../../dynamodbClientService');

exports.updateWorkItemInCase = async ({
  applicationContext,
  caseToUpdate,
  workItem,
}) => {
  let documentIndex = null;
  let workItemIndex = null;
  caseToUpdate.documents.forEach((document, dIndex) =>
    document.workItems.forEach((item, wIndex) => {
      if (item.workItemId === workItem.workItemId) {
        documentIndex = dIndex;
        workItemIndex = wIndex;
      }
    }),
  );

  await client.update({
    ExpressionAttributeNames: {
      '#documents': 'documents',
      '#workItems': 'workItems',
    },
    ExpressionAttributeValues: {
      ':workItem': workItem,
    },
    Key: {
      pk: `case|${caseToUpdate.caseId}`,
      sk: `case|${caseToUpdate.caseId}`,
    },
    UpdateExpression: `SET #documents[${documentIndex}].#workItems[${workItemIndex}] = :workItem`,
    applicationContext,
  });
};
