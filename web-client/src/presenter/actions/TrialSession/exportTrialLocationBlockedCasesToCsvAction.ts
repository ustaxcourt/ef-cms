import { download, generateCsv, mkConfig } from 'export-to-csv';

export const exportTrialLocationBlockedCasesToCsvAction = ({
  props,
}: ActionProps) => {
  const csvConfig = mkConfig({
    columnHeaders: [
      {
        displayLabel: 'Docket No.',
        key: 'docketNumberWithSuffix',
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
        key: 'blockedReason',
      },
    ],
    filename: props.fileName,
    useKeysAsHeaders: false,
  });

  const csv = generateCsv(csvConfig)(props.blockedCases);

  download(csvConfig)(csv);
};
