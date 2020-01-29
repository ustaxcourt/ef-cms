import { state } from 'cerebral';

export const editDocketEntryMetaHelper = get => {
  let docketEntryMetaFormComponent;

  const caseDetail = get(state.caseDetail);
  const docketRecordIndex = get(state.docketRecordIndex);

  const docketRecord = caseDetail.docketRecord.find(
    docketEntry => docketEntry.index == docketRecordIndex,
  );

  if (docketRecord.documentId) {
    docketEntryMetaFormComponent = 'Document';
  } else {
    docketEntryMetaFormComponent = 'No Document';
  }

  // TODO: Some logic to determine docketEntryMetaFormComponent value (one of: CourtIssued, Document, or NoDocument)

  return {
    docketEntryMetaFormComponent,
  };
};
