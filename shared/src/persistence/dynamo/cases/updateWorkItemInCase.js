const client = require('../../dynamodbClientService');

exports.updateWorkItemInCase = async ({
  applicationContext,
  caseToUpdate,
  workItem,
}) => {
  let documentId = null;
  let workItemIndex = null;
  caseToUpdate.documents.forEach(document =>
    document.workItems.forEach((item, wIndex) => {
      if (item.workItemId === workItem.workItemId) {
        ({ documentId } = document);
        workItemIndex = wIndex;
      }
    }),
  );

  await client.update({
    ExpressionAttributeNames: {
      '#workItems': 'workItems',
    },
    ExpressionAttributeValues: {
      ':workItem': workItem,
    },
    Key: {
      pk: `case|${caseToUpdate.caseId}`,
      sk: `document|${documentId}`,
    },
    UpdateExpression: `SET #workItems[${workItemIndex}] = :workItem`,
    applicationContext,
  });
};
