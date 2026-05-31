import {
  GetCustomCaseReportRequest,
  GetCustomCaseReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { applicationContext } from '@web-client/applicationContext';
import { get } from '../requests';

export const getCustomCaseReportInteractor = (
  filters: GetCustomCaseReportRequest,
): Promise<GetCustomCaseReportResponse> => {
  return get({
    applicationContext,
    endpoint: '/reports/custom-case-report',
    params: filters,
  });
};
