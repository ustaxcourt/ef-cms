import { state } from '@web-client/presenter/app.cerebral';

/**
 * setQCWorkItemIdToMarkAsReadIfNeededAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} the props to update
 */
export const setQCWorkItemIdToMarkAsReadIfNeededAction = ({
  get,
  props,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const initialDocument = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );

  const unreadQCWorkItem =
    initialDocument?.workItem && !initialDocument.workItem.isRead
      ? initialDocument.workItem
      : undefined;

  let workItemIdToMarkAsRead;
  if (unreadQCWorkItem) {
    workItemIdToMarkAsRead = unreadQCWorkItem.workItemId;
  }

  return { workItemIdToMarkAsRead };
};
