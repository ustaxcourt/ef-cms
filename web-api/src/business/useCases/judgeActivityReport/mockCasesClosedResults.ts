import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { CasesClosedReturnType } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';

const mockClosedCases = 3;
const mockClosedDismissedCases = 2;

export const casesClosedResults: CasesClosedReturnType = {
  aggregations: {
    [CASE_STATUS_TYPES.closed]: mockClosedCases,
    [CASE_STATUS_TYPES.closedDismissed]: mockClosedDismissedCases,
  },
  total: 5,
};
