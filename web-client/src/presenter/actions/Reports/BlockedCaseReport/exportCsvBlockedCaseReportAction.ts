import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
// import { stringify } from 'csv-stringify/sync';

export const exportCsvBlockedCaseReportAction = ({
  props,
}: ActionProps<{
  blockedCases: BlockedFormattedCase[];
}>) => {
  const { blockedCases } = props;
  //convert array to csv string
  //blob 64bit
  // download
  console.log('blockedCases', blockedCases);
  // console.log('stringify', stringify);
};

// function exportColdCaseCsv() {
//   const today = formatNow(FORMATS.MMDDYYYY);
//   const fileName = `Cold Case Report - ${today}`;
//   const csvConfig = mkConfig({
//     columnHeaders: [
//       {
//         displayLabel: 'Docket No.',
//         key: 'docketNumberWithSuffix',
//       },
//       {
//         displayLabel: 'Date Created',
//         key: 'createdAt',
//       },
//       {
//         displayLabel: 'Case Type',
//         key: 'caseType',
//       },
//       {
//         displayLabel: 'Requested Place of Trial',
//         key: 'preferredTrialCity',
//       },
//       {
//         displayLabel: 'Last Entry',
//         key: 'filingDate',
//       },
//       {
//         displayLabel: 'Last Event',
//         key: 'eventCode',
//       },
//     ],
//     filename: fileName,
//     useKeysAsHeaders: false,
//   });
//   const csv = generateCsv(csvConfig)(entries);
//   download(csvConfig)(csv);
// }
