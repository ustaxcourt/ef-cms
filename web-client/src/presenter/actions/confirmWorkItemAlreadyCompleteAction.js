import { state } from 'cerebral';

/**
 * navigate the user back to the proper page depending on where they original came from
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const confirmWorkItemAlreadyCompleteAction = ({ get }) => {
  const fromPage = get(state.fromPage);
  const caseDetail = get(state.caseDetail);
  const { FROM_PAGES } = get(state.constants);

  switch (fromPage) {
    case FROM_PAGES.qcSectionInbox:
      location.href = '/document-qc/section/inbox';
      break;
    default:
      location.href = `/case-detail/${caseDetail.docketNumber}`;
      break;
  }
};
