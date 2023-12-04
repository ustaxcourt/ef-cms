import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const exportPendingReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const judge = get(state.pendingReports.selectedJudge);

  const csvString = await applicationContext
    .getUseCases()
    .exportPendingReportInteractor(applicationContext, {
      judge,
    });

  const today = applicationContext
    .getUtilities()
    .formatNow(FORMATS.MMDDYYYY_UNDERSCORED);

  const fileName = 'Pending Report - ' + judge + ' ' + today;

  applicationContext.getUtilities().downloadCsv(csvString, fileName);
};
