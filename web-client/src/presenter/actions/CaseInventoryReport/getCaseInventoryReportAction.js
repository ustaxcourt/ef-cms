import { state } from 'cerebral';

/**
 * get the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const getCaseInventoryReportAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const { associatedJudge, page, status } = get(state.screenMetadata);

  if (associatedJudge || status) {
    const reportData = await applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor(applicationContext, {
        associatedJudge,
        page,
        status,
      });
    const currentData = get(state.caseInventoryReportData) || {};

    const results = {
      foundCases: (currentData.foundCases || []).concat(reportData.foundCases),
      totalCount: reportData.totalCount,
    };

    store.set(state.caseInventoryReportData, results);
  } else {
    store.unset(state.caseInventoryReportData);
  }
};
