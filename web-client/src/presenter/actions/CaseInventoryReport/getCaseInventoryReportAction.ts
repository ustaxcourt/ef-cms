import { state } from '@web-client/presenter/app.cerebral';

/**
 * get the case inventory report data
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const getCaseInventoryReportAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{ selectedPage: number }>) => {
  const { associatedJudge, status } = get(state.screenMetadata);
  const { selectedPage } = props;

  if (associatedJudge || status) {
    const reportData = await applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor(applicationContext, {
        associatedJudge,
        selectedPage,
        status,
      });

    store.set(
      state.caseInventoryReportData.foundCasesForCurrentPage,
      reportData.foundCases,
    );
    store.set(
      state.caseInventoryReportData.foundCasesTotalCount,
      Number(reportData.totalCount),
    );
  } else {
    store.unset(state.caseInventoryReportData);
  }
};
