import { state } from '@web-client/presenter/app.cerebral';

export const getColdCaseReportAction = async ({
  applicationContext,
  store,
}: ActionProps) => {
  try {
    const entries = await applicationContext
      .getUseCases()
      .getColdCaseReportInteractor(applicationContext);
    store.set(state.coldCaseReport.entries, entries);
  } catch (e) {
    console.error(e);
  }
};
