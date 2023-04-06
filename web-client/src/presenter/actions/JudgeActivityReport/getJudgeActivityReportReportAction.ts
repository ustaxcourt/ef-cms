/**
 * Retrieves the judge's activity for the provided dates
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the judge activity report
 */
export const getJudgeActivityReportReportAction = async ({
  applicationContext,
  props,
}) => {
  const judgeActivityReport = await applicationContext
    .getUseCases()
    .getJudgeActivityReportReportInteractor(applicationContext, {
      endDate: props.computedEndDate,
      startDate: props.computedStartDate,
    });

  return { judgeActivityReport };
};
