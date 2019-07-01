import { state } from 'cerebral';

/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} caseId
 */
export const setCasePropFromStateAction = ({ get }) => {
  const caseId = get(state.caseDetail.caseId);
  const docketNumber = get(state.caseDetail.docketNumber);
  return { caseId, docketNumber };
};
