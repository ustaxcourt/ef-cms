import { find } from 'lodash';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  const { eventCode } = get(state.form);

  const caseDetail = get(state.caseDetail);
  const validationErrors = get(state.validationErrors);
  const form = get(state.form);

  const {
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

  const amendmentEventCodes = ['AMAT', 'ADMT'];

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  let categoryInformation;
  find(
    INTERNAL_CATEGORY_MAP,
    entries => (categoryInformation = find(entries, { eventCode: eventCode })),
  );

  const optionsForCategory = getOptionsForCategory(
    applicationContext,
    caseDetail,
    categoryInformation,
  );

  return {
    partyValidationError,
    primary: optionsForCategory,
    showObjection:
      objectionDocumentTypes.includes(form.documentType) ||
      (amendmentEventCodes.includes(form.eventCode) &&
        objectionDocumentTypes.includes(form.previousDocument?.documentType)),
    showSecondaryParty,
  };
};
