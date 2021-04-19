import { state } from 'cerebral';

export const filingPartiesFormHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const validationErrors = get(state.validationErrors);
  const form = get(state.form);

  const {
    CONTACT_TYPES,
    INTERNAL_CATEGORY_MAP,
    PARTY_TYPES,
  } = applicationContext.getConstants();

  const partyValidationError =
    validationErrors &&
    (validationErrors.partyPrimary ||
      validationErrors.partySecondary ||
      validationErrors.partyIrsPractitioner);

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const otherPetitioners = caseDetail.petitioners.filter(
    petitioner => petitioner.contactType === CONTACT_TYPES.otherPetitioner,
  );

  console.log('~~~otherPetitioners', otherPetitioners);

  const amendmentEventCodes = ['AMAT', 'ADMT'];

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  return {
    noMargin:
      objectionDocumentTypes.includes(form.documentType) ||
      (amendmentEventCodes.includes(form.eventCode) &&
        objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    otherPetitioners,
    partyValidationError,
    showSecondaryParty,
  };
};
