import { state } from 'cerebral';

/**
 * calls the setForHearingInteractor to set the hearing for one or more trial sessions for a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
// export const setForHearingAction = async ({ applicationContext, get }) => {
export const setForHearingAction = async ({ get }) => {
  const { docketNumber } = get(state.caseDetail);
  const { trialSessionId } = get(state.modal);

  return {
    // alertSuccess,
    // caseDetail,
    docketNumber,
    trialSessionId,
  };
};
