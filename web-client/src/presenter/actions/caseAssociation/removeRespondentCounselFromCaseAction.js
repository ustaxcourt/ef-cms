import { state } from 'cerebral';

/**
 * removes the respondent counsel from the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context for calling a use case
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @returns {object} alertSuccess, docketNumber, and tab
 */
export const removeRespondentCounselFromCaseAction = async ({
  applicationContext,
  get,
}) => {
  const { barNumber } = get(state.form);
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;

  const respondentCounsel = caseDetail.irsPractitioners.find(
    practitioner => practitioner.barNumber === barNumber,
  );

  await applicationContext
    .getUseCases()
    .deleteCounselFromCaseInteractor(applicationContext, {
      docketNumber,
      userId: respondentCounsel.userId,
    });

  return {
    alertSuccess: {
      message: 'Respondent Counsel removed.',
    },
    docketNumber,
    tab: 'caseInfo',
  };
};
