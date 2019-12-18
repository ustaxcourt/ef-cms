import { state } from 'cerebral';

/**
 * update props from case detail state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props
 */
export const primePropsFromCaseDetailAction = ({ get }) => {
  const caseDetail = get(state.caseDetail);

  return { caseDetail };
};
