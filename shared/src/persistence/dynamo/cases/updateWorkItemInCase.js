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
      pk: caseToUpdate.caseId,
      sk: '0',
    },
    UpdateExpression: `SET #documents[${documentIndex}].#workItems[${workItemIndex}] = :workItem`,
    applicationContext,
  });
};
