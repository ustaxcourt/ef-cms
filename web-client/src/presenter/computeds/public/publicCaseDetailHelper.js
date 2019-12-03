import { state } from 'cerebral';

export const publicCaseDetailHelper = get => {
  const publicCase = get(state.caseDetail);

  const formatDocketRecord = docketRecord =>
    (docketRecord || []).map(entry => {
      entry.showPaperIcon = !!(entry.document && entry.document.isPaper);
      return entry;
    });
  const formatCaseDetail = caseToFormat => caseToFormat;

  const formattedDocketRecord = formatDocketRecord(publicCase.docketRecord);
  const formattedCaseDetail = formatCaseDetail(publicCase);

  return { formattedCaseDetail, formattedDocketRecord };
};
