import { FORMATS } from '@shared/business/utilities/DateHandler';

function generateCsvString(
  valueMappings: [string, string][],
  records: any[],
): string {
  const headerString = valueMappings
    .map(([headerTitle]) => headerTitle)
    .join(',');
  const casesString = records
    .map(aCase => {
      const caseValues = valueMappings.map(mapping => {
        const propertyName = mapping[1];
        const value = aCase[propertyName];
        if (!value) return '';
        let stringValue = aCase[propertyName]?.split('"').join('""');
        if (stringValue.includes(',')) stringValue = `"${stringValue}"`;
        return stringValue;
      });
      return caseValues.join(',');
    })
    .join('\n');

  return headerString + '\n' + casesString;
}

export const formatCustomCaseReportDataForCsvAction = ({
  applicationContext,
  props,
}: ActionProps<{
  formattedCases: {
    docketNumber: string;
    receivedAt: string;
    caseCaption: string;
    status: string;
    caseType: string;
    associatedJudge: string;
    preferredTrialCity: string;
    calendaringHighPriority: string;
  }[];
}>) => {
  const { formattedCases } = props;

  const CUSTOM_CASE_REPORT_MAPPINGS: [string, string][] = [
    ['Docket No.', 'docketNumber'],
    ['Date Created', 'receivedAt'],
    ['Case Title', 'caseCaption'],
    ['Case Status', 'status'],
    ['Case Type', 'caseType'],
    ['Judge', 'associatedJudge'],
    ['Requested Place of Trial', 'preferredTrialCity'],
    ['Calendaring High Priority', 'calendaringHighPriority'],
  ];

  const csvString = generateCsvString(
    CUSTOM_CASE_REPORT_MAPPINGS,
    formattedCases,
  );

  const today = applicationContext.getUtilities().formatNow(FORMATS.MMDDYYYY);
  const fileName = 'Custom Case Report - ' + today;

  return {
    csvString,
    fileName,
  };
};
