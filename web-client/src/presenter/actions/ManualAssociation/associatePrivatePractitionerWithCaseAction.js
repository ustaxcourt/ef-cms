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
  const { representingPrimary, representingSecondary, serviceIndicator } = get(
    state.modal,
  );
  const caseId = get(state.caseDetail.caseId);

  await applicationContext
    .getUseCases()
    .associatePrivatePractitionerWithCaseInteractor({
      applicationContext,
      caseId,
      representingPrimary,
      representingSecondary,
      serviceIndicator,
      userId,
    });

  return path.success({
    alertSuccess: {
      message: 'You can view Petitioner Counsel details below.',
      title: 'Petitioner Counsel has been added to this case.',
    },
  });
};
