exports.updateCaseStatusOnWorkItems = async ({
  applicationContext,
  caseStatus,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext.getPersistenceGateway().updateWorkItemCaseStatus({
      applicationContext,
      caseStatus,
      docketNumber: workItem.docketNumber,
      workItemId: workItem.workItemId,
    }),
  );

  await Promise.all(workItemUpdates);
};
