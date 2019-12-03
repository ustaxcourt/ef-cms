import { state } from 'cerebral';

export const publicCaseDetailHelper = (get, applicationContext) => {
  const publicCase = get(state.caseDetail);

  const formatCaseDetail = caseToFormat => caseToFormat;

  const formattedDocketRecord = publicCase.docketRecord.map(d =>
    applicationContext.getUtilities().formatDocketRecord(applicationContext, d),
  );

  const formattedDocketRecordWithDocument = applicationContext
    .getUtilities()
    .formatDocketRecordWithDocument(
      applicationContext,
      formattedDocketRecord,
      publicCase.documents,
    );

  const formattedCaseDetail = formatCaseDetail(publicCase);

  return { formattedCaseDetail, formattedDocketRecordWithDocument };
};
