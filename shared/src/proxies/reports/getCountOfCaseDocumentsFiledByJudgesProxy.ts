import { CaseDocumentsAggregationReturnType } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { get } from '../requests';

export const getCountOfCaseDocumentsFiledByJudgesInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<CaseDocumentsAggregationReturnType> => {
  return get({
    applicationContext,
    endpoint: '/case-documents/count',
    params,
  });
};
