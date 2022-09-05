exports.updateCaseTitleOnWorkItems = async ({
  applicationContext,
  caseTitle,
  workItemId,
}) => {
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsByWorkItemId({ applicationContext, workItemId });

  const workItemUpdates = workItems.map(workItem =>
    applicationContext
      .getPersistenceGateway()
      .updateWorkItemCaseTitle({ applicationContext, caseTitle, workItem }),
  );

  return Promise.all(workItemUpdates);
};
