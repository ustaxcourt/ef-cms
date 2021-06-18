import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * used for editing the petitioner information
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} object containing the view settings
 */
export const editPetitionerInformationHelper = (get, applicationContext) => {
  const { CONTACT_TYPES } = applicationContext.getConstants();
  const permissions = get(state.permissions);
  const { contact } = cloneDeep(get(state.form));
  const userPendingEmail = get(state.screenMetadata.userPendingEmail);
  const showEditEmail = permissions.EDIT_PETITIONER_EMAIL && !userPendingEmail;
  const showSealAddress = permissions.SEAL_ADDRESS;

  const caseDetail = get(state.caseDetail);

  const petitioners = caseDetail.petitioners.filter(
    p => p.contactType === CONTACT_TYPES.petitioner,
  );

  const canRemovePetitioner =
    contact.contactType === CONTACT_TYPES.petitioner && petitioners.length > 1;

  const isOtherFiler =
    contact.contactType === CONTACT_TYPES.intervenor ||
    contact.contactType === CONTACT_TYPES.participant;

  let intervenorContactId;
  caseDetail.petitioners.forEach(party => {
    if (party.contactType === CONTACT_TYPES.intervenor) {
      intervenorContactId = party.contactId;
    }
  });

  const showIntervenorRole =
    !intervenorContactId || contact.contactId === intervenorContactId;

  const showRemovePetitionerButton =
    (isOtherFiler || canRemovePetitioner) && permissions.REMOVE_PETITIONER;

  return {
    showEditEmail,
    showIntervenorRole,
    showRemovePetitionerButton,
    showSealAddress,
    userPendingEmail,
  };
};
