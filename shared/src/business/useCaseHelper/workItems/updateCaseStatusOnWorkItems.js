exports.updateCaseStatusOnWorkItems = async ({
  applicationContext,
  caseStatus,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'caseStatus',
      attributeValue: caseStatus,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  await Promise.all(workItemUpdates);
};
