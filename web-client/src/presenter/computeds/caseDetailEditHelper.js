import { state } from 'cerebral';
import { showContactsHelper } from '../computeds/showContactsHelper';

export const caseDetailEditHelper = get => {
  const { PARTY_TYPES } = get(state.constants);
  const partyType = get(state.caseDetail.partyType);
  const documents = get(state.caseDetail.documents);

  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  const showOwnershipDisclosureStatement =
    partyType === PARTY_TYPES.partnershipAsTaxMattersPartner ||
    partyType === PARTY_TYPES.partnershipOtherThanTaxMatters ||
    partyType === PARTY_TYPES.partnershipBBA ||
    partyType === PARTY_TYPES.corporation;

  let ownershipDisclosureStatementDocumentId;
  if (showOwnershipDisclosureStatement && documents) {
    const odsDocs = documents.filter(document => {
      return document.documentType === 'Ownership Disclosure Statement';
    });
    if (odsDocs[0]) {
      ownershipDisclosureStatementDocumentId = odsDocs[0].documentId;
    }
  }

  return {
    partyTypes: PARTY_TYPES,

    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,

    showOwnershipDisclosureStatement,
    ownershipDisclosureStatementDocumentId,
  };
};
