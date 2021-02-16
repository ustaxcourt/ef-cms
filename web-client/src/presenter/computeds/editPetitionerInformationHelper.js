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
  const permissions = get(state.permissions);
  const partyType = get(state.form.partyType);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);
  const showLoginAndServiceInformation = permissions.EDIT_PETITIONER_EMAIL;

  const contactPrimaryEmail = get(state.form.contactPrimary.email);
  const contactSecondaryEmail = get(state.form.contactSecondary.email);

  const contactPrimaryHasEmail = !!contactPrimaryEmail;
  const contactSecondaryHasEmail = !!contactSecondaryEmail;

  return {
    contactPrimaryHasEmail,
    contactSecondaryHasEmail,
    partyTypes: PARTY_TYPES,
    showLoginAndServiceInformation,
    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
