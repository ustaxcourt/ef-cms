exports.updateTrialDateOnWorkItems = async ({
  applicationContext,
  trialDate,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'trialDate',
      attributeValue: trialDate,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  await Promise.all(workItemUpdates);
};
