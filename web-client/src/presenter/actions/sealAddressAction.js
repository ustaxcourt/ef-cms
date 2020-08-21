import { state } from 'cerebral';

/**
 * seals the contact address information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get method
 */
export const sealAddressAction = async ({ applicationContext, get }) => {
  const { contactId } = get(state.contactToSeal);
  const { docketNumber } = get(state.caseDetail);

  return await applicationContext
    .getUseCases()
    .sealCaseContactAddressInteractor({
      applicationContext,
      contactId,
      docketNumber,
    });
};
