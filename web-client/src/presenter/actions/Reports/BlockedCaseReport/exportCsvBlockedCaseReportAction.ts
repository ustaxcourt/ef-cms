import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { generateCsv, mkConfig } from 'export-to-csv';

export type BlockedCsvCase = Pick<
  BlockedFormattedCase,
  | 'docketNumber'
  | 'blockedDateEarliest'
  | 'caseTitle'
  | 'status'
  | 'blockedReason'
  | 'automaticBlockedReason'
>;

export const exportCsvBlockedCaseReportAction = ({
  props,
}: ActionProps<{
  blockedCases: BlockedCsvCase[];
  trialLocation: string;
}>) => {
  const { blockedCases, trialLocation } = props;
  const [city, state] = trialLocation.split(', ');
  const date = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = `Blocked Cases Report - ${city}_${state} ${date}`;
  const blockedCasesCsvConfiguration = {
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
  };
  const csvConfig = mkConfig(blockedCasesCsvConfiguration);

  const formatString = (s: string | undefined) =>
    (s || '').split('\n').join(' ').trim();

  generateCsv(csvConfig)(
    blockedCases.map(c => ({
      ...c,
      allReasons: `${formatString(c.blockedReason)} ${formatString(c.automaticBlockedReason)}`,
    })),
  );
  // download(csvConfig)(csv);
};
