import { state } from '@web-client/presenter/app.cerebral';

/**
 * unseals the contact address information on a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.store the cerebral store method
 *  @returns {Promise} async action
 */
export const unsealAddressAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const contactToSeal = get(state.contactToSeal);
  if (!contactToSeal) {
    throw new Error('Contact to unseal is required');
  }
  const { contactId, name } = contactToSeal;
  const { docketNumber } = get(state.caseDetail);

  await applicationContext
    .getUseCases()
    .unsealCaseContactAddressInteractor(applicationContext, {
      contactId,
      docketNumber,
    });

  store.set(state.form.isAddressSealed, false);

  return {
    alertSuccess: {
      message: `Address unsealed for ${name}.`,
    },
  };
};
