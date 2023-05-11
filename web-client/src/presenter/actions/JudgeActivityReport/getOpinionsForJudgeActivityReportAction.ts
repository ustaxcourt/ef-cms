import { state } from 'cerebral';

/**
 * Fetches the opinions within a date range for the judge activity report
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context object
 * @returns {object} contains the opinions returned from the use case
 */
export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const opinions = await applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
    });

  return { opinions };
};
