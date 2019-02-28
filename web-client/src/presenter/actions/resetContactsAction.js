import { state } from 'cerebral';

/**
 * Forwards the workItem associated with props.workItemId to a form.forwardRecipientId and also adds the message set on form.forwardMessage.
 * Displays a success alert on success.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Object} providers.store the cerebral store
 */
export const resetContactsAction = async ({ get, store }) => {
  store.set(state.caseDetail.contactPrimary, {
    countryType: 'domestic',
    email: get(state.caseDetail.contactPrimary.email),
  });
  store.set(state.caseDetail.contactSecondary, { countryType: 'domestic' });
};
