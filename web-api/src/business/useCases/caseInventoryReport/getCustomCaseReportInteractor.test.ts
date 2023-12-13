import {
  GetCustomCaseReportRequest,
  getCustomCaseReportInteractor,
} from './getCustomCaseReportInteractor';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

describe('getCustomCaseReportInteractor', () => {
  let params: GetCustomCaseReportRequest;
  beforeEach(() => {
    params = {
      caseStatuses: ['CAV'],
      caseTypes: ['Deficiency'],
      endDate: '2022-02-01T17:21:05.483Z',
      filingMethod: 'all',
      judges: [],
      pageSize: 100,
      preferredTrialCities: ['Birmingham, Alabama'],
      procedureType: 'All',
      searchAfter: { pk: '', receivedAt: 827493 },
      startDate: '2022-01-01T17:21:05.483Z',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '9754a349-1013-44fa-9e61-d39aba2637e0',
    });
  });

  describe('Validation', () => {
    it('throws an error if user is not authorized for case inventory report', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitioner, //petitioner does not have CASE_INVENTORY_REPORT permission
        userId: '8e20dd1b-d142-40f4-8362-6297f1be68bf',
      });

      await expect(
        getCustomCaseReportInteractor(applicationContext, params),
      ).rejects.toThrow('Unauthorized for case inventory report');
    });

    it('should be valid when no arguments are passed in for getCustomCaseReportInteractor', async () => {
      await expect(
        getCustomCaseReportInteractor(applicationContext, {
          caseStatuses: undefined,
          caseTypes: undefined,
          filingMethod: 'all',
          judges: undefined,
          pageSize: 10,
          preferredTrialCities: undefined,
          procedureType: 'All',
          searchAfter: {
            pk: '',
            receivedAt: 1,
          },
        } as any),
      ).resolves.not.toThrow();
    });

    const testCases = [
      { missingField: 'filingMethod' },
      { missingField: 'procedureType' },
    ];

    testCases.forEach(testCase => {
      it(`throws an error if ${testCase.missingField} is not passed in`, async () => {
        delete params[testCase.missingField];

        await expect(
          getCustomCaseReportInteractor(applicationContext, params),
        ).rejects.toThrow();
      });
    });
  });

  it('should fetch cases from persistence with the user selected filters', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByFilters.mockResolvedValue({
        foundCases: [],
        totalCount: 0,
      });

    await getCustomCaseReportInteractor(applicationContext, params);

    expect(
      applicationContext.getPersistenceGateway().getCasesByFilters,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      params,
    });
  });
});
