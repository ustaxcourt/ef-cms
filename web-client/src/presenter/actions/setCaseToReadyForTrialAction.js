import { state } from 'cerebral';

/**
 * sets the case status to General Docket - Ready for Trial
 * NOTE: this is a temporary function for testing purposes - normally, cases
 * will be set to ready for trial 45 days after an Answer document is filed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const setCaseToReadyForTrialAction = async ({
  applicationContext,
  get,
}) => {
  const caseId = get(state.caseDetail.caseId);

  await applicationContext.getUseCases().setCaseToReadyForTrialInteractor({
    applicationContext,
    caseId,
  });
};
