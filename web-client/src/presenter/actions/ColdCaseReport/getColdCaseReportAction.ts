import { getColdCaseReportInteractor } from '@shared/proxies/reports/getColdCaseReportProxy';
import { state } from '@web-client/presenter/app.cerebral';

export const getColdCaseReportAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  try {
    const entries = await getColdCaseReportInteractor(applicationContext);
    store.set(state.coldCaseReport.entries, entries);
  } catch (e) {
    console.error(e);
  }
};
