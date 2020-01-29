import { state } from 'cerebral';

export const editDocketEntryMetaHelper = (get, applicationContext) => {
  let docketEntryMetaFormComponent;

  const caseDetail = get(state.caseDetail);
  const docketRecordIndex = get(state.docketRecordIndex);
  const validationErrors = get(state.validationErrors);
  const form = get(state.form);

  const docketRecord = caseDetail.docketRecord.find(
    docketEntry => docketEntry.index == docketRecordIndex,
  );

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

  if (docketRecord.documentId) {
    docketEntryMetaFormComponent = 'Document';
  } else {
    docketEntryMetaFormComponent = 'No Document';
  }

  // TODO: Some logic to determine docketEntryMetaFormComponent value (one of: CourtIssued, Document, or NoDocument)

  return {
    docketEntryMetaFormComponent,
    partyValidationError,
    showObjection: objectionDocumentTypes.includes(form.documentType),
    showSecondaryParty,
  };
};
