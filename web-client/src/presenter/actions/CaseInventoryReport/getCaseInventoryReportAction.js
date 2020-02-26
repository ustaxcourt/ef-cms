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
  const { associatedJudge, status } = get(state.screenMetadata);

  const reportData = await applicationContext
    .getUseCases()
    .getCaseInventoryReportInteractor({
      applicationContext,
      associatedJudge,
      status,
    });

  store.set(state.caseInventoryReportData, reportData);
};
