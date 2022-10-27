import { state } from 'cerebral';

/**
 * invokes the path in the sequences depending on if the user is logged in or not
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.props the cerebral sequence props
 * @param {object} providers.path the cerebral path function
 * @returns {object} the list of section work items
 */
export const isWorkItemAlreadyCompletedAction = ({ get, path, props }) => {
  const caseDetail = get(state.caseDetail);
  const { docketEntryId } = props;

  const { workItem } = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );

  if (workItem.completedAt) {
    return path['yes']();
  } else {
    return path['no']();
  }
};
