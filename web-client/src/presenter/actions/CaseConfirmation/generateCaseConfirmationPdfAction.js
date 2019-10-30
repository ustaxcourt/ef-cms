import { state } from 'cerebral';

/**
 * generate the case confiramtion pdf for the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const generateCaseConfirmationPdfAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId } = get(state.caseDetail);

  await applicationContext.getUseCases().generateCaseConfirmationPdfInteractor({
    applicationContext,
    caseId,
  });
};
