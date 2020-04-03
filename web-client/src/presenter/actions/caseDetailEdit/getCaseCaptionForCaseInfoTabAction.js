import { state } from 'cerebral';

/**
 * Fetches the case caption using the getCaseCaption helper method
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext application context to get Case entity
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the caseCaption
 */
export const getCaseCaptionForCaseInfoTabAction = ({
  applicationContext,
  get,
}) => {
  const { Case } = applicationContext.getEntityConstructors();
  let caseCaption = Case.getCaseCaption(get(state.caseDetail)) || '';

  // NOTE: case caption should never have the postfix value. Perhaps you're looking for case title?

  return { caseCaption };
};
