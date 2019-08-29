import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab
 */
export const updateUserContactAction = async ({ applicationContext, get }) => {
  const user = get(state.user);
  const contactInfo = get(state.user.contact);

  await applicationContext
    .getUseCases()
    .updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: user.userId,
    });

  return {
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
  };
};
