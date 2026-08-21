import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getColdCaseReportInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<ColdCaseEntry[]> => {
  return get({
    applicationContext,
    endpoint: '/reports/cold-case-report',
  });
};
