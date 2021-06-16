import { state } from 'cerebral';

export const filingPartiesFormHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const validationErrors = get(state.validationErrors);
  const form = get(state.form);

  const { INTERNAL_CATEGORY_MAP, PARTY_TYPES } =
    applicationContext.getConstants();

  const partyValidationError =
    validationErrors &&
    (validationErrors.filers || validationErrors.partyIrsPractitioner);

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const amendmentEventCodes = ['AMAT', 'ADMT'];

  const isServed = applicationContext.getUtilities().isServed(form);

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  return {
    isServed,
    noMargin:
      objectionDocumentTypes.includes(form.documentType) ||
      (amendmentEventCodes.includes(form.eventCode) &&
        objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    partyValidationError,
    showSecondaryParty,
  };
};
