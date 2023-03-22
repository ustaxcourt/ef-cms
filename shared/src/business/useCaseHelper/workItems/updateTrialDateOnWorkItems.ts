exports.updateTrialDateOnWorkItems = async ({
  applicationContext,
  trialDate,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateWorkItemTrialDate({
      applicationContext,
      docketNumber: workItem.docketNumber,
      trialDate,
      workItemId: workItem.workItemId,
    }),
  );

  await Promise.all(workItemUpdates);
};
