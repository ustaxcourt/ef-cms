import { state } from 'cerebral';

/**
 * setQCWorkItemIdToMarkAsReadIfNeededAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} the props to update
 */
export const setQCWorkItemIdToMarkAsReadIfNeededAction = ({ get, props }) => {
  let workItemIdToMarkAsRead;
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const initialDocument =
    caseDetail.docketEntries.find(
      entry => entry.docketEntryId === docketEntryId,
    ) || {};

  const unreadQCWorkItem =
    initialDocument.workItem && !initialDocument.workItem.isRead
      ? initialDocument.workItem
      : undefined;

  if (unreadQCWorkItem) {
    workItemIdToMarkAsRead = unreadQCWorkItem.workItemId;
  }

  return { workItemIdToMarkAsRead };
};
