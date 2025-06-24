import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates practitioner contact information
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 */
export const updatePractitionerContactInformationAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const formUser = get(state.form);
  const currentUser = get(state.user);
  const clientConnectionId = get(state.clientConnectionId);

  store.set(state.userContactEditProgress.inProgress, true);

  await applicationContext
    .getUseCases()
    .updatePractitionerContactInformationInteractor(applicationContext, {
      contactInfo: formUser.contact,
      firmName: formUser.firmName,
      userId: currentUser.userId,
      clientConnectionId,
    });
};
