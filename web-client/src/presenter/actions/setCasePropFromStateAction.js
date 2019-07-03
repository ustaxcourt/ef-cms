import { state } from 'cerebral';

/**
 * sets the props.caseId and props.docketNumber from the case in the state,
 * to be passed to subsequent actions
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
