import { state } from '@web-client/presenter/app.cerebral';

/**
 * invokes the path in the sequences depending on if the user is logged in or not
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.path the cerebral path function
 * @returns {object} the list of section work items
 */
export const isWorkItemAlreadyCompletedAction = ({
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const { workItem } = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );

  if (workItem?.completedAt) {
    return path['yes']();
  } else {
    return path['no']();
  }
};
