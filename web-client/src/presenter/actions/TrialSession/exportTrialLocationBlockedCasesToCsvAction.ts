import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { state } from '@web-client/presenter/app.cerebral';

export const exportTrialLocationBlockedCasesToCsvAction = ({
  get,
  props,
}: ActionProps) => {
  const [city, usState] = get(state.trialLocationPage.location).split('-');
  const date = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);

  const fileName = `${props.exportFileString} - ${city}_${usState} ${date}`;

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
    filename: fileName,
    useKeysAsHeaders: false,
  });

  const csv = generateCsv(csvConfig)(props.blockedCases);

  download(csvConfig)(csv);
};
