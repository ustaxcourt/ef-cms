import { state } from 'cerebral';

export const printPaperServiceHelper = get => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  if (docketEntryId) {
    const doc = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );
    return { documentTitle: doc.documentTitle };
  } else {
    return {};
  }
};
