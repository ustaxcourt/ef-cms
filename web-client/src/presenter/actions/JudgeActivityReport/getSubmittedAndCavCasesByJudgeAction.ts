import { CAV_AND_SUBMITTED_CASE_STATUS } from '../../../../../shared/src/business/entities/EntityConstants';
import { JudgeActivityReportStatusSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportStatusSearch';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Retrieves the cases with a status of CAV or Submitted by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} an array of case entities and a map containing consolidated cases group counts
 */
export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { judgesSelection } = get(state.judgeActivityReport.filters);
  const statuses = CAV_AND_SUBMITTED_CASE_STATUS;

  new JudgeActivityReportStatusSearch({ judgesSelection, statuses }).validate();

  const { cases, consolidatedCasesGroupCountMap } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judgesSelection,
      statuses,
    });

  return {
    consolidatedCasesGroupCountMap: new Map(
      Object.entries(consolidatedCasesGroupCountMap),
    ),
    submittedAndCavCasesByJudge: cases,
  };
};
