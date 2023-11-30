import { FORMATS } from '@shared/business/utilities/DateHandler';
import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const exportPendingReportAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  //create fileName
  const today = applicationContext
    .getUtilities()
    .formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = getFileName(get(state.pendingReports.selectedJudge), today);
  const formattedPendingItems = get(state.formattedPendingItemsHelper.items);
  const headers = [
    'Docket No.',
    'Date Filed',
    'Case Title',
    'Filings and Proceedings',
    'Case Status',
    'Judge',
  ];

  const data = formattedPendingItems.map(item => {
    return pick(item, [
      'docketNumberWithSuffix',
      'formattedFiledDate',
      'caseTitle',
      'formattedName',
      'formattedStatus',
      'associatedJudgeFormatted',
    ]);
  });
  const csv = getCsv(data, headers);

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();
};

const getFileName = (judgeName, date) => {
  return 'Pending Report - ' + judgeName + ' ' + date;
};

const getCsv = (data, headers) => {
  const lines = [headers.join(';')];
  for (let item of data) {
    const line = Object.values(item).map(x => escapeCsvValue(x));
    lines.push(line.join(';'));
  }
  return lines.join('\n');
};

const escapeCsvValue = value => {
  if (!value || value.indexOf(';') === -1) return value;

  return '"' + value.replace('"', '""') + '"';
};
