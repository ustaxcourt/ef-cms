import { state } from 'cerebral';

export const requestAccessHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = get(state.constants);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
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

  const partyValidationError =
    validationErrors.representingPrimary ||
    validationErrors.representingSecondary;

  let exported = {
    certificateOfServiceDateFormatted,
    partyValidationError,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryParty,
  };

  return exported;
};
