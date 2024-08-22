import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { download, generateCsv, mkConfig } from 'export-to-csv';

export const exportCsvBlockedCaseReportAction = ({
  props,
}: ActionProps<{
  blockedCases: BlockedFormattedCase[];
  trialLocation: string;
}>) => {
  const { blockedCases, trialLocation } = props;
  const [city, state] = trialLocation.split(', ');
  const date = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = `Blocked Cases Report - ${city}_${state} ${date}`;
  const csvConfig = mkConfig({
    columnHeaders: [
      {
        displayLabel: 'Docket No.',
        key: 'docketNumber',
      },
      {
        displayLabel: 'Date Blocked',
        key: 'blockedDateEarliest',
      },
      {
        displayLabel: 'Case Title',
        key: 'caseTitle',
      },
      {
        displayLabel: 'Case Status',
        key: 'status',
      },
      {
        displayLabel: 'Reason',
        key: 'allReasons',
      },
    ],
    filename: fileName,
    useKeysAsHeaders: false,
  });

  const csv = generateCsv(csvConfig)(
    blockedCases.map(c => ({
      ...c,
      allReasons: `${c.blockedReason?.trim()} ${c.automaticBlockedReason?.trim()}`,
    })),
  );
  download(csvConfig)(csv);
};
