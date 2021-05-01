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
  const userPendingEmail = get(state.screenMetadata.userPendingEmail);
  const showEditEmail = permissions.EDIT_PETITIONER_EMAIL && !userPendingEmail;

  const caseDetail = get(state.caseDetail);
  const contactPrimaryEmail = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail)?.email;

  const contactPrimaryHasEmail = !!contactPrimaryEmail;

  const showRemovePetitionerButton =
    caseDetail.petitioners.length > 1 && permissions.REMOVE_PETITIONER;

  return {
    contactPrimaryHasEmail,
    partyTypes: PARTY_TYPES,
    showEditEmail,
    showPrimaryContact: showContacts.contactPrimary,
    showRemovePetitionerButton,
    showSecondaryContact: showContacts.contactSecondary,
    userPendingEmail,
  };
};
