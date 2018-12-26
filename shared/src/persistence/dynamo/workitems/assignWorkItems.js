exports.assignWorkItems = async ({ workItems, applicationContext }) => {
  const fullWorkItems = await Promise.all(
    workItems.map(workItem => {
      return applicationContext
        .getPersistenceGateway()
        .getWorkItemById({
          workItemId: workItem.workItemId,
          applicationContext,
        })
        .then(fullWorkItem => ({
          ...fullWorkItem,
          ...workItem,
        }));
    }),
  );

  await Promise.all(
    fullWorkItems.map(workItem => {
      return applicationContext.getPersistenceGateway().saveWorkItem({
        workItemToSave: workItem,
        applicationContext,
      });
    }),
  );
};
