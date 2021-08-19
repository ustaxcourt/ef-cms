import { state } from 'cerebral';

/**
 * submits the edit respondent counsel form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.modal and state.caseDetail.docketNumber
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const submitEditRespondentCounselAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const respondentCounsel = get(state.form);
  const docketNumber = get(state.caseDetail.docketNumber);

  await applicationContext
    .getUseCases()
    .updateCounselOnCaseInteractor(applicationContext, {
      docketNumber,
      userData: respondentCounsel,
      userId: respondentCounsel.userId,
    });

  return path.success({
    alertSuccess: {
      message: 'Respondent counsel updated.',
    },
  });
};
