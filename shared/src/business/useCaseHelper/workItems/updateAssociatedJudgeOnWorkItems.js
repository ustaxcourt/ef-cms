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
      workItem,
    }),
  );

  await Promise.all(workItemUpdates);
};
