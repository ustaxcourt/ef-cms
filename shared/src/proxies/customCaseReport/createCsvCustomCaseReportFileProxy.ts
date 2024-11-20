import { CustomCaseReportCsvRequest } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { applicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const createCsvCustomCaseReportFileInteractor = (
  data: CustomCaseReportCsvRequest,
): Promise<void> => {
  return post({
    applicationContext,
    body: data,
    endpoint: '/async/export/reports/custom-case-report/csv',
  });
};
