import { state } from 'cerebral';

/**
 * Takes the selected work items in the store and invoke the assignWorkItems so that the assignee is attached to each
 * of the work items.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {object} providers.store the cerebral store containing the selectedWorkItems, workQueue, assigneeId, assigneeName this method uses
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const assignSelectedWorkItemsAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.workQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);

  await Promise.all(
    selectedWorkItems.map(workItem =>
      applicationContext
        .getUseCases()
        .assignWorkItemsInteractor(applicationContext, {
          assigneeId,
          assigneeName,
          workItemId: workItem.workItemId,
        }),
    ),
  );

  // Give elasticsearch a chance to catch up
  await new Promise(resolve => setTimeout(resolve, 3000));

  store.set(
    state.workQueue,
    sectionWorkQueue.map(workItem => {
      if (
        selectedWorkItems.find(item => item.workItemId === workItem.workItemId)
      ) {
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
