import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';

/**
 * validateJudgeActivityReportSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {string} providers.endDate the date to end the search for judge activity
 * @returns {object} errors (null if no errors)
 */
export const validateJudgeActivityReportSearchInteractor = (
  applicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  const judgeActivityReportSearch = new JudgeActivityReportSearch(
    { endDate, startDate },
    {
      applicationContext,
    },
  );

  console.log(
    judgeActivityReportSearch.getFormattedValidationErrors(),
    '+++++',
  );

  return judgeActivityReportSearch.getFormattedValidationErrors();
};
