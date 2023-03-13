exports.updateCaseTitleOnWorkItems = async ({
  applicationContext,
  caseTitle,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'caseTitle',
      attributeValue: caseTitle,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  return Promise.all(workItemUpdates);
};
