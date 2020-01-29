import { find } from 'lodash';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  const { documentId, eventCode } = get(state.form);
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const COURT_ISSUED_EVENT_CODES_MAP = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedEvent => courtIssuedEvent.eventCode,
  );

  const hasDocument = !!documentId;

  const isCourtIssuedDocument =
    hasDocument && COURT_ISSUED_EVENT_CODES_MAP.includes(eventCode);

  let docketEntryMetaFormComponent;
  let validationSequenceName = 'validateDocketRecordSequence';
  let submitSequenceName;

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
      validationErrors.partyRespondent);

  const objectionDocumentTypes = [
    ...INTERNAL_CATEGORY_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  if (!hasDocument) {
    docketEntryMetaFormComponent = 'NoDocument';
  } else if (isCourtIssuedDocument) {
    docketEntryMetaFormComponent = 'CourtIssued';
  } else {
    docketEntryMetaFormComponent = 'Document';
  }

  let categoryInformation;
  find(
    INTERNAL_CATEGORY_MAP,
    entries => (categoryInformation = find(entries, { eventCode: eventCode })),
  );

  const optionsForCategory = getOptionsForCategory(
    caseDetail,
    categoryInformation,
  );

  return {
    docketEntryMetaFormComponent,
    partyValidationError,
    primary: optionsForCategory,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showSecondaryParty,
    submitSequenceName,
    validationSequenceName,
  };
};
