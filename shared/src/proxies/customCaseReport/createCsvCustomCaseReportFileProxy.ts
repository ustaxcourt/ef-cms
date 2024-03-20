import { CustomCaseReportCsvRequest } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { post } from '../requests';

export const createCsvCustomCaseReportFileInteractor = (
  applicationContext,
  data: CustomCaseReportCsvRequest,
) => {
  return post({
    applicationContext,
    body: data,
    endpoint: '/async/reports/custom-case-report/csv',
  });
};
