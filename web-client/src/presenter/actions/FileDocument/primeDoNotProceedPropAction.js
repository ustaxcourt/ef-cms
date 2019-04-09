import { state } from 'cerebral';

/**
 * Set docket number as prop. To allow for routing.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function
 *
 * @returns {Object} the docketNumber prop
 */
export const primeDoNotProceedPropAction = ({ get }) => {
  const {
    isDocumentTypeSelected,
    scenario,
    isSecondaryDocumentTypeSelected,
  } = get(state.form);

  const isSecondaryDocumentNeeded = scenario === 'Nonstandard H';
  return {
    doNotProceed:
      !isDocumentTypeSelected ||
      (isSecondaryDocumentNeeded && !isSecondaryDocumentTypeSelected),
  };
};
