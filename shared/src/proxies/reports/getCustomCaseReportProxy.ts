import {
  GetCustomCaseReportRequest,
  GetCustomCaseReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { get } from '../requests';

export const getCustomCaseReportInteractor = (
  applicationContext,
  filters: GetCustomCaseReportRequest,
): Promise<GetCustomCaseReportResponse> => {
  return get({
    applicationContext,
    endpoint: '/reports/custom-case-report',
    params: filters,
  });
};
