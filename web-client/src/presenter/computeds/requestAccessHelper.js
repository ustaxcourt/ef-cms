import { state } from 'cerebral';

export const requestAccessHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const documentType = get(state.form.documentType);
  const validationErrors = get(state.validationErrors);
  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const certificateOfServiceDate = form.certificateOfServiceDate;
  let certificateOfServiceDateFormatted;
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const documentWithExhibits =
    [
      'Motion to Substitute Parties and Change Caption',
      'Notice of Intervention',
      'Notice of Election to Participate',
      'Notice of Election to Intervene',
    ].indexOf(documentType) !== -1;

  const documentWithAttachments =
    [
      'Motion to Substitute Parties and Change Caption',
      'Notice of Intervention',
      'Notice of Election to Participate',
      'Notice of Election to Intervene',
    ].indexOf(documentType) !== -1;

  const documentWithObjections =
    [
      'Substitution of Counsel',
      'Motion to Substitute Parties and Change Caption',
    ].indexOf(documentType) !== -1;

  const documentWithSupportingDocuments =
    ['Motion to Substitute Parties and Change Caption'].indexOf(
      documentType,
    ) !== -1;

  const partyValidationError =
    validationErrors.representingPrimary ||
    validationErrors.representingSecondary;

  let exported = {
    certificateOfServiceDateFormatted,
    documentWithAttachments,
    documentWithExhibits,
    documentWithObjections,
    documentWithSupportingDocuments,
    partyValidationError,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryParty,
  };

  return exported;
};
