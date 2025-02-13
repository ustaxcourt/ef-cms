import { download, generateCsv, mkConfig } from 'export-to-csv';

export const exportTrialLocationEligibleCasesToCsvAction = ({
  props,
}: ActionProps) => {
  const casesForCsv = props.eligibleCases.map(c => {
    let formattedPrivatePractitioners = '';
    c.privatePractitioners.forEach(p => {
      formattedPrivatePractitioners += `${p.name} `;
    });

    let formattedIrsPractitioners = '';
    c.irsPractitioners.forEach(p => {
      formattedIrsPractitioners += `${p.name} `;
    });

    c.privatePractitioners = formattedPrivatePractitioners;
    c.irsPractitioners = formattedIrsPractitioners;
    return c;
  });

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
    filename: props.fileName,
    useKeysAsHeaders: false,
  });

  const csv = generateCsv(csvConfig)(casesForCsv);

  download(csvConfig)(csv);
};
