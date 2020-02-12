import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { state } from 'cerebral';

/**
 * Fetches the case caption using the getCaseCaption helper method
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the caseCaption
 */
export const getInternalCaseCaptionAction = async ({ get }) => {
  const caseCaption = Case.getCaseCaption(get(state.form)) || '';

  return { caseCaption };
};
