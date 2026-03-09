import { state } from '@web-client/presenter/app.cerebral';

export const assignSelectedWorkItemsAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.workQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);

  const workItemIdsToAssign = new Set();

  selectedWorkItems.forEach(workItem => {
    workItemIdsToAssign.add(workItem.workItemId);

    const { multiDocketedOn } = workItem.docketEntry;

    if (multiDocketedOn.length < 2) {
      return;
    }

    sectionWorkQueue.forEach(queueWorkItem => {
      if (
        queueWorkItem.docketEntryId === workItem.docketEntryId &&
        multiDocketedOn.includes(queueWorkItem.docketNumber)
      ) {
        workItemIdsToAssign.add(queueWorkItem.workItemId);
      }
    });
  });

  await Promise.all(
    Array.from(workItemIdsToAssign).map(workItemId =>
      applicationContext
        .getUseCases()
        .assignWorkItemsInteractor(applicationContext, {
          assigneeId,
          assigneeName,
          workItemId,
        }),
    ),
  );

  // Give elasticsearch a chance to catch up
  // TODO: we need a better solution for this; this is causing flaky functionality and failing cypress tests
  await new Promise(resolve => setTimeout(resolve, 3000));

  store.set(
    state.workQueue,
    sectionWorkQueue.map(workItem => {
      if (workItemIdsToAssign.has(workItem.workItemId)) {
        return {
          ...workItem,
          assigneeId,
          assigneeName,
        };
      } else {
        return workItem;
      }
    }),
  );

  store.set(state.selectedWorkItems, []);
  store.unset(state.assigneeId);
  store.unset(state.assigneeName);
};
