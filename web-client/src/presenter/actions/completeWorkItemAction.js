import { state } from 'cerebral';

/**
 * sets a work item who matches the workItemId of props.workItemId as completed.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral store object used for setting workQueue
 * @param {Object} providers.store the cerebral store object used for setting workQueue
 * @param {Object} providers.applicationContext the cerebral store object used for setting workQueue
 * @param {Object} providers.props the cerebral props object
 * @param {Object} providers.props.workItemId the workItemId to set as completed
 * @returns {undefined} doesn't return anything
 */
export const completeWorkItemAction = async ({
  get,
  store,
  applicationContext,
  props,
}) => {
  const completeWorkItemDate = new Date().toISOString();

  const caseDetail = get(state.caseDetail);
  let workItems = [];

  caseDetail.documents.forEach(
    document => (workItems = [...workItems, ...document.workItems]),
  );
  const workItemToUpdate = workItems.find(
    workItem => workItem.workItemId === props.workItemId,
  );
  const completeForm = get(state.completeForm);
  const message =
    (completeForm[props.workItemId] || {}).completeMessage ||
    'work item completed';

  // TODO: All this logic should probably be refactored in put into the interactor.... the action shouldn't have to know the internals of the
  // work item entity just to be able to set it as completed...
  workItemToUpdate.completedAt = completeWorkItemDate;
  workItemToUpdate.completedBy = applicationContext.getCurrentUser().name;
  workItemToUpdate.completedByUserId = applicationContext.getCurrentUser().userId;
  workItemToUpdate.completedMessage = message;

  if (!workItemToUpdate.assigneeId) {
    workItemToUpdate.assigneeId = applicationContext.getCurrentUser().userId;
    workItemToUpdate.assigneeName = applicationContext.getCurrentUser().name;
  }

  store.set(state.caseDetail, caseDetail);

  await applicationContext.getUseCases().updateWorkItem({
    applicationContext,
    userId: applicationContext.getCurrentUser().userId,
    workItemId: props.workItemId,
    workItemToUpdate,
  });
};
