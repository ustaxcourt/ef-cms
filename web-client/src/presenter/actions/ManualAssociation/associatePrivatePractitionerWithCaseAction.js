import { state } from 'cerebral';

/**
 * associates a practitioner with case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const associatePrivatePractitionerWithCaseAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const userId = get(state.modal.user.userId);
  const { representing, serviceIndicator } = get(state.modal);
  const docketNumber = get(state.caseDetail.docketNumber);

  await applicationContext
    .getUseCases()
    .associatePrivatePractitionerWithCaseInteractor(applicationContext, {
      docketNumber,
      representing,
      serviceIndicator,
      userId,
    });

  return path.success({
    alertSuccess: {
      message: 'Petitioner counsel added to case.',
    },
  });
};
