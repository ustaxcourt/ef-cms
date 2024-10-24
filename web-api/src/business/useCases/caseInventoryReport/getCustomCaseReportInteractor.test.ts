jest.mock('@web-api/persistence/elasticsearch/getCasesByFilters');
import {
  GetCustomCaseReportRequest,
  getCustomCaseReportInteractor,
} from './getCustomCaseReportInteractor';
import { getCasesByFilters as getCasesByFiltersMock } from '@web-api/persistence/elasticsearch/getCasesByFilters';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getCustomCaseReportInteractor', () => {
  const getCasesByFilters = jest.mocked(getCasesByFiltersMock);
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
        getCustomCaseReportInteractor(params, mockPetitionerUser),
      ).rejects.toThrow('Unauthorized for case inventory report');
    });

    it('should be valid when no arguments are passed in for getCustomCaseReportInteractor', async () => {
      await expect(
        getCustomCaseReportInteractor(
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
          getCustomCaseReportInteractor(params, mockDocketClerkUser),
        ).rejects.toThrow();
      });
    });
  });

  it('should fetch cases from persistence with the user selected filters', async () => {
    getCasesByFilters.mockResolvedValue({
      foundCases: [],
      lastCaseId: { pk: 'case|102-20', receivedAt: 0 },
      totalCount: 0,
    });

    await getCustomCaseReportInteractor(params, mockDocketClerkUser);

    expect(getCasesByFilters).toHaveBeenCalledWith({
      params,
    });
  });
});
