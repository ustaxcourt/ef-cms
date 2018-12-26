exports.assignWorkItems = async ({
  assigneeId,
  assigneeName,
  workItemIds,
  applicationContext,
}) => {
  const workItems = await Promise.all(
    workItemIds.map(workItemId =>
      applicationContext.getPersistenceGateway().getWorkItemById({
        workItemId,
        applicationContext,
      }),
    ),
  );

  await Promise.all(
    workItems.map(workItem => {
      workItem.assigneeId = assigneeId;
      workItem.assigneeName = assigneeName;
      return applicationContext.getPersistenceGateway().saveWorkItem({
        workItemToSave: workItem,
        applicationContext,
      });
    }),
  );
};
