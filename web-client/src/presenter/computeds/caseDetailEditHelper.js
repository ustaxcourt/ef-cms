import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * gets the case detail view options based on partyType
 * and documents
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showOwnershipDisclosureStatement, and ownershipDisclosureStatementDocumentId
 */
export const caseDetailEditHelper = get => {
  const { PARTY_TYPES } = get(state.constants);
  const partyType = get(state.caseDetail.partyType);
  const documents = get(state.caseDetail.documents);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  let showOwnershipDisclosureStatement = false;
  let ownershipDisclosureStatementDocumentId;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(partyType) &&
    documents
  ) {
    const odsDocs = documents.filter(document => {
      return document.documentType === 'Ownership Disclosure Statement';
    });
    showOwnershipDisclosureStatement = true;
    if (odsDocs[0]) {
      ownershipDisclosureStatementDocumentId = odsDocs[0].documentId;
    }
  }

  return {
    ownershipDisclosureStatementDocumentId,
    partyTypes: PARTY_TYPES,
    showOwnershipDisclosureStatement,
    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
