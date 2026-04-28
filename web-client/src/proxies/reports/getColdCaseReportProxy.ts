import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import { get } from '../requests';

export const getColdCaseReportInteractor = (
  applicationContext,
): Promise<{
  results: ColdCaseEntry[];
}> => {
  return get({
    applicationContext,
    endpoint: '/reports/cold-case-report',
  });
};
