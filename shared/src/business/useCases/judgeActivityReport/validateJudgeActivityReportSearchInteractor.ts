import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';

/**
 * validateJudgeActivityReportSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {string} providers.judgeName the name of the judge to search on
 * @param {string} providers.endDate the date to end the search for judge activity
 * @returns {object} errors (null if no errors)
 */
export const validateJudgeActivityReportSearchInteractor = ({
  endDate,
  judgeName,
  startDate,
}: {
  endDate: string;
  startDate: string;
  judgeName: string;
}) => {
  const judgeActivityReportSearch = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    startDate,
  });

  return judgeActivityReportSearch.getFormattedValidationErrors();
};
