import {
  GetCustomCaseReportRequest,
  getCustomCaseReportInteractor,
} from './getCustomCaseReportInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

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
      searchAfter: { pk: '123-45', receivedAt: 827493 },
      startDate: '2022-01-01T17:21:05.483Z',
    };
  });

  describe('Validation', () => {
    it('throws an error if user is not authorized for case inventory report', async () => {
      await expect(
        getCustomCaseReportInteractor(
          applicationContext,
          params,
          mockPetitionerUser,
        ),
      ).rejects.toThrow('Unauthorized for case inventory report');
    });

    it('should be valid when no arguments are passed in for getCustomCaseReportInteractor', async () => {
      await expect(
        getCustomCaseReportInteractor(
          applicationContext,
          {
            caseStatuses: undefined,
            caseTypes: undefined,
            filingMethod: 'all',
            judges: undefined,
            pageSize: 10,
            preferredTrialCities: undefined,
            procedureType: 'All',
          } as any,
          mockDocketClerkUser,
        ),
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
          getCustomCaseReportInteractor(
            applicationContext,
            params,
            mockDocketClerkUser,
          ),
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

    await getCustomCaseReportInteractor(
      applicationContext,
      params,
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesByFilters,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      params,
    });
  });
});
