export const updateTrialLocationOnWorkItems = async ({
  applicationContext,
  trialLocation,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'trialLocation',
      attributeValue: trialLocation,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  await Promise.all(workItemUpdates);
};
