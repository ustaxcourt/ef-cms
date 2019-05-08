import { state } from 'cerebral';
import moment from 'moment';

export const requestAccessHelper = get => {
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
    certificateOfServiceDateFormatted = moment
      .utc(certificateOfServiceDate)
      .format('L');
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
