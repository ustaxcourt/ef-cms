exports.updateTrialLocationOnWorkItems = async ({
  applicationContext,
  trialLocation,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateWorkItemTrialDate({
      applicationContext,
      docketNumber: workItem.docketNumber,
      trialLocation,
      workItemId: workItem.workItemId,
    }),
  );

  await Promise.all(workItemUpdates);
};
