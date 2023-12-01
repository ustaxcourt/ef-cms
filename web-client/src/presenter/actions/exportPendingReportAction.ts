import { FORMATS } from '@shared/business/utilities/DateHandler';
// import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const exportPendingReportAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  //remove
  const start = Date.now();
  const judge = get(state.pendingReports.selectedJudge);

  const csvString = await applicationContext
    .getUseCases()
    .exportPendingReportInteractor(applicationContext, {
      judge,
      method: props.method,
    });

  console.log('this is the csv string', csvString);

  const today = applicationContext
    .getUtilities()
    .formatNow(FORMATS.MMDDYYYY_UNDERSCORED);

  const fileName = getFileName(judge, today);

  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();

  console.log(`Time elapsed: ${Date.now() - start} ms`);
};

const getFileName = (judgeName, date) => {
  return 'Pending Report - ' + judgeName + ' ' + date;
};
