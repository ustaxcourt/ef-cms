import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { state } from '@web-client/presenter/app.cerebral';

export const exportTrialLocationEligibleCasesToCsvAction = ({
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
        displayLabel: 'Case Title',
        key: 'caseTitle',
      },
      {
        displayLabel: 'Petitioner Counsel',
        key: 'privatePractitioners',
      },
      {
        displayLabel: 'Respondent Counsel',
        key: 'irsPractitioners',
      },
      {
        displayLabel: 'Case Type',
        key: 'caseType',
      },
    ],
    filename: fileName,
    useKeysAsHeaders: false,
  });

  const csv = generateCsv(csvConfig)(props.eligibleCases);

  download(csvConfig)(csv);
};
