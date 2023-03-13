exports.updateAssociatedJudgeOnWorkItems = async ({
  applicationContext,
  associatedJudge,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'associatedJudge',
      attributeValue: associatedJudge,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  await Promise.all(workItemUpdates);
};
