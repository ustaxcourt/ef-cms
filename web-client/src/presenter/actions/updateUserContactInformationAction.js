import { state } from 'cerebral';

/**
 * updates user contact information (for practitioners)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 */
export const updateUserContactInformationAction = async ({
  applicationContext,
  get,
}) => {
  const formUser = get(state.form);
  const currentUser = applicationContext.getCurrentUser();

  await applicationContext
    .getUseCases()
    .updateUserContactInformationInteractor(applicationContext, {
      contactInfo: formUser.contact,
      firmName: formUser.firmName,
      userId: currentUser.userId,
    });
};
