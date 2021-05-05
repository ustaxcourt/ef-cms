import { state } from 'cerebral';

/**
 * removes the respondents counsel from the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context for getting constants
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @returns {object} the next path based on if validation was successful or error
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

  await applicationContext.getUseCases().deleteCounselFromCaseInteractor({
    applicationContext,
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
