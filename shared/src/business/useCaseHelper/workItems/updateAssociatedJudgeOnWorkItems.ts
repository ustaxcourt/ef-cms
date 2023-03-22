exports.updateAssociatedJudgeOnWorkItems = async ({
  applicationContext,
  associatedJudge,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateWorkItemAssociatedJudge({
      applicationContext,
      associatedJudge,
      docketNumber: workItem.docketNumber,
      workItemId: workItem.workItemId,
    }),
  );

  await Promise.all(workItemUpdates);
};
