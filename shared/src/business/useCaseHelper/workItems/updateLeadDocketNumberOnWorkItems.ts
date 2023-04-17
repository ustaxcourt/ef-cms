export const updateLeadDocketNumberOnWorkItems = async ({
  applicationContext,
  leadDocketNumber,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  leadDocketNumber: string;
  workItemId: string;
}): Promise<void> => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord({
      applicationContext,
      attributeKey: 'leadDocketNumber',
      attributeValue: leadDocketNumber,
      pk: workItem.pk,
      sk: workItem.sk,
    }),
  );

  await Promise.all(workItemUpdates);
};
