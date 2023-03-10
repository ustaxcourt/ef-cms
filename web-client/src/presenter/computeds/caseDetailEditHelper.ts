import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * gets the case detail view options based on partyType
 * and documents
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showCorporateDisclosureStatement, and corporateDisclosureStatementDocumentId
 */
export const caseDetailEditHelper = (get, applicationContext) => {
  const { PARTY_TYPES, PAYMENT_STATUS } = applicationContext.getConstants();
  const caseDetail = get(state.form);
  const showContacts = showContactsHelper(caseDetail.partyType, PARTY_TYPES);

  let showCorporateDisclosureStatement = false;
  let corporateDisclosureStatementDocumentId,
    requestForPlaceOfTrialDocumentId,
    requestForPlaceOfTrialDocumentTitle;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(caseDetail.partyType) &&
    caseDetail.docketEntries
  ) {
    const cdsDocs = caseDetail.docketEntries.filter(doc => {
      return doc.documentType === 'Corporate Disclosure Statement';
    });
    showCorporateDisclosureStatement = true;
    if (cdsDocs[0]) {
      corporateDisclosureStatementDocumentId = cdsDocs[0].docketEntryId;
    }
  }

  if (caseDetail.docketEntries) {
    const rptDocs = caseDetail.docketEntries.filter(doc => {
      return doc.documentType === 'Request for Place of Trial';
    });
    if (rptDocs[0]) {
      requestForPlaceOfTrialDocumentId = rptDocs[0].docketEntryId;
      requestForPlaceOfTrialDocumentTitle = rptDocs[0].documentTitle;
    }
  }

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(caseDetail.receivedAt, 'MMDDYYYY');

  return {
    corporateDisclosureStatementDocumentId,
    partyTypes: PARTY_TYPES,
    receivedAtFormatted,
    requestForPlaceOfTrialDocumentId,
    requestForPlaceOfTrialDocumentTitle,
    shouldShowIrsNoticeDate: caseDetail.hasVerifiedIrsNotice,
    showCorporateDisclosureStatement,
    showOrderForFilingFee:
      caseDetail.petitionPaymentStatus === PAYMENT_STATUS.UNPAID,
    showPrimaryContact: showContacts.contactPrimary,
    showRQTDocumentLink: caseDetail.isPaper && requestForPlaceOfTrialDocumentId,
    showReadOnlyTrialLocation:
      !caseDetail.isPaper && caseDetail.preferredTrialCity,
    showSecondaryContact: showContacts.contactSecondary,
  };
};
