import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@shared/proxies/reports/getCustomCaseReportProxy', () =>
  mockFactory('getCustomCaseReportInteractor'),
);
