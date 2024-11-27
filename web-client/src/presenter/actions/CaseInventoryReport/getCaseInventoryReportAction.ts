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
  store,
}: ActionProps) => {
  const { associatedJudge, status } = get(state.screenMetadata);

  if (associatedJudge || status) {
    const reportData = await applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor(applicationContext, {
        associatedJudge,
        status,
      });

    store.set(state.caseInventoryReportData, {
      foundCases: reportData.foundCases,
    });
  } else {
    store.unset(state.caseInventoryReportData);
  }
};
