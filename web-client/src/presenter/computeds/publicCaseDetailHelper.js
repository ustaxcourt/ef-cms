import { state } from 'cerebral';

export const publicCaseDetailHelper = (get, applicationContext) => {
  const publicCase = get(state.caseDetail);

  const formatDocketRecord = docketRecord => docketRecord || [];
  const formatCaseDetail = caseToFormat => caseToFormat;

  const formattedDocketRecord = formatDocketRecord(publicCase.docketRecord);
  const formattedCaseDetail = formatCaseDetail(publicCase);

  return { formattedCaseDetail, formattedDocketRecord };
};
