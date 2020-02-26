import { state } from 'cerebral';

/**
 * get the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the report data
 */
export const getCaseInventoryReportAction = async ({
  applicationContext,
  get,
}) => {
  const { associatedJudge, status } = get(state.modal);

  const reportData = await applicationContext
    .getUseCases()
    .getCaseInventoryReportInteractor({
      applicationContext,
      associatedJudge,
      status,
    });

  return { reportData };
};
