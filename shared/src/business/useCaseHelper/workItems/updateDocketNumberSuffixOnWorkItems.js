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
        docketNumberSuffix,
        workItem,
      }),
  );

  await Promise.all(workItemUpdates);
};
