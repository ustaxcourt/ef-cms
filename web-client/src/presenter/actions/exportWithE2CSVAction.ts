import { FORMATS } from '@shared/business/utilities/DateHandler';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { state } from '@web-client/presenter/app.cerebral';

export const exportWithE2CSVAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  //remove
  const start = Date.now();

  const today = applicationContext
    .getUtilities()
    .formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = getFileName(get(state.pendingReports.selectedJudge), today);
  const formattedPendingItems = get(state.formattedPendingItemsHelper.items);
  const csvConfig = mkConfig({
    columnHeaders: [
      { displayLabel: 'Docket No.', key: 'docketNumberWithSuffix' },
      { displayLabel: 'Date Filed', key: 'formattedFiledDate' },
      { displayLabel: 'Case Title', key: 'caseTitle' },
      { displayLabel: 'Filings and Proceedings', key: 'formattedName' },
      { displayLabel: 'Case Status', key: 'formattedStatus' },
      { displayLabel: 'Judge', key: 'associatedJudgeFormatted' },
    ],
    filename: fileName,
  });

  const csv = generateCsv(csvConfig)(formattedPendingItems);

  download(csvConfig)(csv);

  console.log(`Time elapsed: ${Date.now() - start} ms`);
};

const getFileName = (judgeName, date) => {
  return 'Pending Report - ' + judgeName + ' ' + date;
};
