import {
  CaseDocumentsAggregationReturnType,
  JudgeActivityReportFilters,
} from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
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
