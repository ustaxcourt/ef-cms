import { state } from 'cerebral';

/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setWorkItemIdFromMessageIdAction = ({ store, get }) => {
  const caseDetail = get(state.caseDetail);
  const messageId = get(state.messageId);

  let workItemId;

  caseDetail.documents.forEach(document => {
    document.workItems.forEach(workItem => {
      workItem.messages.forEach(message => {
        if (message.messageId === messageId) {
          workItemId = workItem.workItemId;
        }
      });
    });
  });

  store.set(state.workItemId, workItemId);
};
