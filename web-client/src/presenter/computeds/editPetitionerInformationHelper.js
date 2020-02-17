import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * used for editing the petitioner information
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} object containing the view settings
 */
export const editPetitionerInformationHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = applicationContext.getConstants();
  const partyType = get(state.form.partyType);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  return {
    partyTypes: PARTY_TYPES,
    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
