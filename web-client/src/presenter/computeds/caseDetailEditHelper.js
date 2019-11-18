import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * gets the case detail view options based on partyType
and documents
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showOwnershipDisclosureStatement, and ownershipDisclosureStatementDocumentId
 */
export const caseDetailEditHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const showContacts = showContactsHelper(caseDetail.partyType, PARTY_TYPES);

  let showOwnershipDisclosureStatement = false;
  let ownershipDisclosureStatementDocumentId,
    requestForPlaceOfTrialDocumentId,
    requestForPlaceOfTrialDocumentTitle;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(caseDetail.partyType) &&
    caseDetail.documents
  ) {
    const odsDocs = caseDetail.documents.filter(document => {
      return document.documentType === 'Ownership Disclosure Statement';
    });
    showOwnershipDisclosureStatement = true;
    if (odsDocs[0]) {
      ownershipDisclosureStatementDocumentId = odsDocs[0].documentId;
    }
  }

  if (caseDetail.documents) {
    const rptDocs = caseDetail.documents.filter(document => {
      return document.documentType.includes('Request for Place of Trial');
    });
    if (rptDocs[0]) {
      requestForPlaceOfTrialDocumentId = rptDocs[0].documentId;
      requestForPlaceOfTrialDocumentTitle = rptDocs[0].documentTitle;
    }
  }

  return {
    ownershipDisclosureStatementDocumentId,
    partyTypes: PARTY_TYPES,
    requestForPlaceOfTrialDocumentId,
    requestForPlaceOfTrialDocumentTitle,
    showNoTrialLocationSelected:
      caseDetail.isPaper && !requestForPlaceOfTrialDocumentId,
    showOwnershipDisclosureStatement,
    showPrimaryContact: showContacts.contactPrimary,
    showRQTDocumentLink: caseDetail.isPaper && requestForPlaceOfTrialDocumentId,
    showReadOnlyTrialLocation:
      !caseDetail.isPaper && caseDetail.preferredTrialCity,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
