import { getOptionsForContact } from './caseDetailEditContactsHelper';
import { state } from 'cerebral';

/**
 * gets the contact view options based on form.partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const startCaseInternalContactsHelper = get => {
  const partyType = get(state.form.partyType);
  const { PARTY_TYPES } = get(state.constants);

  const contacts = getOptionsForContact({ PARTY_TYPES, partyType });

  return contacts;
};
