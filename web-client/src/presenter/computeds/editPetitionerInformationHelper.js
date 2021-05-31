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
  const {
    PARTY_TYPES,
    PETITIONER_CONTACT_TYPES,
  } = applicationContext.getConstants();
  const permissions = get(state.permissions);
  const partyType = get(state.form.partyType);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);
  const userPendingEmail = get(state.screenMetadata.userPendingEmail);
  const showEditEmail = permissions.EDIT_PETITIONER_EMAIL && !userPendingEmail;
  const showSealAddress = permissions.SEAL_ADDRESS;

  const caseDetail = get(state.caseDetail);

  const petitioners = caseDetail.petitioners.filter(p =>
    PETITIONER_CONTACT_TYPES.includes(p.contactType),
  );

  const showRemovePetitionerButton =
    petitioners.length > 1 && permissions.REMOVE_PETITIONER;

  return {
    partyTypes: PARTY_TYPES,
    showEditEmail,
    //fixme delete
    showPrimaryContact: showContacts.contactPrimary,
    showRemovePetitionerButton,
    showSealAddress,
    showSecondaryContact: showContacts.contactSecondary,
    userPendingEmail,
  };
};
