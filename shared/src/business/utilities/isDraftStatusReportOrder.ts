export const isDraftStatusReportOrder = (docketEntry): boolean => {
  // At an absolute minimum, a draft status report order will have
  // docketEntry.draftOrderState.statusReportFilingDate and
  // docketEntry.draftOrderState.statusReportIndex
  return !!(
    docketEntry &&
    typeof docketEntry === 'object' &&
    docketEntry.draftOrderState &&
    typeof docketEntry.draftOrderState === 'object' &&
    docketEntry.draftOrderState.statusReportFilingDate &&
    docketEntry.draftOrderState.statusReportIndex
  );
};
