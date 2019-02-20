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
export default async ({ get, store, applicationContext, props }) => {
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

  workItemToUpdate.completedAt = completeWorkItemDate;
  workItemToUpdate.messages = [
    ...workItemToUpdate.messages,
    {
      message,
      sentBy: get(state.user.token),
      userId: get(state.user.token),
    },
  ];

  if (!workItemToUpdate.assigneeId) {
    workItemToUpdate.assigneeId = get(state.user.token);
    workItemToUpdate.assigneeName = get(state.user.name);
  }

  store.set(state.caseDetail, caseDetail);

  await applicationContext.getUseCases().updateWorkItem({
    applicationContext,
    workItemToUpdate,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });
};
