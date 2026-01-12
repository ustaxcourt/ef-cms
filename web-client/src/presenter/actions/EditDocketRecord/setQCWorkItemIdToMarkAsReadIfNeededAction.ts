import { DocketEntry } from '@shared/business/entities/DocketEntry';
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

  const docketEntry = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );

  const hasWorkItemInfo = docketEntry && DocketEntry.hasWorkItemInfo(docketEntry);

  const workItemIsUnread = hasWorkItemInfo && !docketEntry?.qcViewed;

  let workItemIdToMarkAsRead;
  if (workItemIsUnread) {
    workItemIdToMarkAsRead = docketEntry.workItemId;
  }

  return { workItemIdToMarkAsRead };
};
