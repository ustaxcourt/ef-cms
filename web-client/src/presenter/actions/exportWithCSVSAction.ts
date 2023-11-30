import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';
import { stringify } from 'csv-stringify/browser/esm/sync';

export const exportWithCSVSAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const start = Date.now();

  const today = applicationContext
    .getUtilities()
    .formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = getFileName(get(state.pendingReports.selectedJudge), today);
  const formattedPendingItems = get(state.formattedPendingItemsHelper.items);
  const csv = stringify(formattedPendingItems, {
    bom: true,
    columns: [
      { header: 'Docket No.', key: 'docketNumberWithSuffix' },
      { header: 'Date Filed', key: 'formattedFiledDate' },
      { header: 'Case Title', key: 'caseTitle' },
      { header: 'Filings and Proceedings', key: 'formattedName' },
      { header: 'Case Status', key: 'formattedStatus' },
      { header: 'Judge', key: 'associatedJudgeFormatted' },
    ],
    header: true,
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();

  console.log(`Time elapsed: ${Date.now() - start} ms`);
};

const getFileName = (judgeName, date) => {
  return 'Pending Report - ' + judgeName + ' ' + date;
};
