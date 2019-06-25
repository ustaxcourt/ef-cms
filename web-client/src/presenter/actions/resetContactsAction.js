import { state } from 'cerebral';

import { showContactsHelper } from '../computeds/showContactsHelper';

/**
 * clears primary and secondary contact in caseDetail depending on
 * party type (except email); also defaults countryType to domestic
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const resetContactsAction = ({ get, store }) => {
  const partyType = get(state.caseDetail.partyType);
  const { COUNTRY_TYPES, PARTY_TYPES } = get(state.constants);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  store.set(state.caseDetail.contactPrimary, {
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: get(state.caseDetail.contactPrimary.email),
  });
  if (showContacts.contactSecondary) {
    store.set(state.caseDetail.contactSecondary, {
      countryType: COUNTRY_TYPES.DOMESTIC,
    });
  }
};
