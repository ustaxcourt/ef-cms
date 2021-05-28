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
  const { CONTACT_TYPES, PARTY_TYPES } = applicationContext.getConstants();
  const permissions = get(state.permissions);
  const partyType = get(state.form.partyType);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);
  const userPendingEmail = get(state.screenMetadata.userPendingEmail);
  const showEditEmail = permissions.EDIT_PETITIONER_EMAIL && !userPendingEmail;
  const showSealAddress = permissions.SEAL_ADDRESS;

  const caseDetail = get(state.caseDetail);

  const petitionerContactTypes = [
    CONTACT_TYPES.primary,
    CONTACT_TYPES.secondary,
    CONTACT_TYPES.otherPetitioner,
    CONTACT_TYPES.petitioner,
  ];

  const petitioners = caseDetail.petitioners.filter(p =>
    petitionerContactTypes.includes(p.contactType),
  );

  const showRemovePetitionerButton =
    petitioners.length > 1 && permissions.REMOVE_PETITIONER;

  return {
    partyTypes: PARTY_TYPES,
    showEditEmail,
    showPrimaryContact: showContacts.contactPrimary,
    showRemovePetitionerButton,
    showSealAddress,
    showSecondaryContact: showContacts.contactSecondary,
    userPendingEmail,
  };
};
