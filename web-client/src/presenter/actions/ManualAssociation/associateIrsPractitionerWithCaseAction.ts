import { state } from 'cerebral';

/**
 * associates a respondent with case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const associateIrsPractitionerWithCaseAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const userId = get(state.modal.user.userId);
  const serviceIndicator = get(state.modal.serviceIndicator);
  const docketNumber = get(state.caseDetail.docketNumber);

  await applicationContext
    .getUseCases()
    .associateIrsPractitionerWithCaseInteractor(applicationContext, {
      docketNumber,
      serviceIndicator,
      userId,
    });

  return path.success({
    alertSuccess: {
      message: 'Respondent counsel added to case.',
    },
  });
};
