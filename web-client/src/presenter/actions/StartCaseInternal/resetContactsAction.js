import { showContactsHelper } from '../../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * clears primary and secondary contact in form depending on
 * party type (except email); also defaults countryType to domestic
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const resetContactsAction = ({ applicationContext, get, store }) => {
  const partyType = get(state.form.partyType);
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  store.set(state.form.contactPrimary, {
    countryType: COUNTRY_TYPES.DOMESTIC,
  });
  if (showContacts.contactSecondary) {
    store.set(state.form.contactSecondary, {
      countryType: COUNTRY_TYPES.DOMESTIC,
    });
  }
};
