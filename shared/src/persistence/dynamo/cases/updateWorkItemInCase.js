const client = require('../../dynamodbClientService');

exports.updateWorkItemInCase = async ({
  applicationContext,
  caseToUpdate,
  workItem,
}) => {
  let documentId = null;
  caseToUpdate.documents.forEach(document => {
    if (
      document.workItem &&
      document.workItem.workItemId === workItem.workItemId
    ) {
      ({ documentId } = document);
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
      sk: `document|${documentId}`,
    },
    UpdateExpression: 'SET #workItem = :workItem',
    applicationContext,
  });
};
