exports.updateDocketNumberSuffixOnWorkItems = async ({
  applicationContext,
  docketNumberSuffix,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext
      .getPersistenceGateway()
      .updateWorkItemDocketNumberSuffix({
        applicationContext,
        docketNumber: workItem.docketNumber,
        docketNumberSuffix,
        workItemId: workItem.workItemId,
      }),
  );

  await Promise.all(workItemUpdates);
};
