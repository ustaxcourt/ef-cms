import {
  GetCaseInventoryReportRequest,
  GetCaseInventoryReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { get } from '../requests';

export const getCustomCaseInventoryReportInteractor = (
  applicationContext,
  filters: GetCaseInventoryReportRequest,
): Promise<GetCaseInventoryReportResponse> => {
  return get({
    applicationContext,
    endpoint: '/reports/custom-case-inventory-report',
    params: filters,
  });
};
