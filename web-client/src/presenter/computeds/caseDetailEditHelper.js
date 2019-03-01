import { state } from 'cerebral';
import { showContactsHelper } from '../computeds/showContactsHelper';

export const caseDetailEditHelper = get => {
  const { PARTY_TYPES } = get(state.constants);
  const partyType = get(state.caseDetail.partyType);

  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  return {
    partyTypes: PARTY_TYPES,

    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
