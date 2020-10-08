import { state } from 'cerebral';

export const printPaperServiceHelper = get => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  if (docketEntryId) {
    const document = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );
    return { documentTitle: document.documentType };
  } else {
    return {};
  }
};
