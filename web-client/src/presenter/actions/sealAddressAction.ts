import { state } from 'cerebral';

/**
 * seals the contact address information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.store the cerebral store method
 *  @returns {Promise} async action
 */
export const sealAddressAction = async ({ applicationContext, get, store }) => {
  const { contactId, name } = get(state.contactToSeal);
  const { docketNumber } = get(state.caseDetail);

  const updatedCase = await applicationContext
    .getUseCases()
    .sealCaseContactAddressInteractor(applicationContext, {
      contactId,
      docketNumber,
    });

  store.set(state.form.isAddressSealed, true);

  return {
    alertSuccess: {
      message: `Address sealed for ${name}.`,
    },
    caseDetail: updatedCase,
  };
};
