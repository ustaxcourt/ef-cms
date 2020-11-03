import { state } from 'cerebral';

/**
 * checks the docketEntry if it's pending or not
 *
 * @param {object} providers the providers object
 * @param {object} providers.get cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const getIsPendingItemAction = ({ get, path }) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const docketEntry = (caseDetail.docketEntries || []).find(
    ({ docketEntryId: _docketEntryId }) => docketEntryId === _docketEntryId,
  );

  if (docketEntry.pending) {
    return path.yes();
  }

  return path.no();
};
