import { getOptionsForContact } from './caseDetailEditContactsHelper';
import { state } from 'cerebral';

/**
 * gets the contact view options based on form.partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const editPractitionerContactHelper = (get, applicationContext) => {
  const partyType = get(state.form.partyType);
  const { PARTY_TYPES } = applicationContext.getConstants();

  const contactPrimaryEmail = get(state.form.contactPrimary.email);
  const contactSecondaryEmail = get(state.form.contactSecondary.email);

  const isElectronicAvailableForPrimary = !!contactPrimaryEmail;
  const isElectronicAvailableForSecondary = !!contactSecondaryEmail;

  const contacts = getOptionsForContact({ PARTY_TYPES, partyType });

  return {
    ...contacts,
    isElectronicAvailableForPrimary,
    isElectronicAvailableForSecondary,
  };
};
