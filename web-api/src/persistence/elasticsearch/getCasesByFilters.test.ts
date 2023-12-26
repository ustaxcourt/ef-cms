import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CUSTOM_CASE_REPORT_PAGE_SIZE,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  CustomCaseReportFilters,
  GetCustomCaseReportRequest,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  emptyResults,
  mockCaseSearchResult,
} from './searchClient.test.constants';
import { formatResults } from './searchClient';
import { getCasesByFilters } from './getCasesByFilters';

jest.mock('./searchClient', () => ({
  formatResults: jest.fn(),
}));
const mockFormatResults = formatResults as jest.Mock;

describe('getCasesByFilters', () => {
  const defaultStartDate = '2000-06-13T12:00:00.000Z';
  const defaultEndDate = '2023-06-13T12:00:00.000Z';
  const defaultParams: CustomCaseReportFilters = {
    caseStatuses: [],
    caseTypes: [],
    endDate: defaultEndDate,
    filingMethod: 'all',
    highPriority: undefined,
    judges: [],
    preferredTrialCities: [],
    procedureType: 'All',
    startDate: defaultStartDate,
  };
  const defaultRequest: GetCustomCaseReportRequest = {
    ...defaultParams,
    pageSize: CUSTOM_CASE_REPORT_PAGE_SIZE,
    searchAfter: { pk: '', receivedAt: 0 },
  };

  beforeAll(() => {
    applicationContext.getSearchClient().search.mockReturnValue(emptyResults);
    mockFormatResults.mockReturnValue({ results: {}, total: 0 });
  });

  it('should search for all cases in a given date range when only default filters are applied', async () => {
    await getCasesByFilters({
      applicationContext,
      params: defaultRequest,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].size,
    ).toEqual(CUSTOM_CASE_REPORT_PAGE_SIZE);
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        must: [
          {
            range: {
              'receivedAt.S': {
                gte: defaultStartDate,
                lt: defaultEndDate,
              },
            },
          },
        ],
      },
    });
    expect(mockFormatResults).toHaveBeenCalled();
  });

  it('should apply selected filters to search query', async () => {
    const requestWithFilters: GetCustomCaseReportRequest = {
      ...defaultRequest,
      caseStatuses: [CASE_STATUS_TYPES.closed, CASE_STATUS_TYPES.generalDocket],
      caseTypes: [CASE_TYPES_MAP.deficiency, CASE_TYPES_MAP.whistleblower],
      filingMethod: 'paper',
      highPriority: true,
      judges: ['Buch'],
      preferredTrialCities: ['Birmingham, Alabama'],
      procedureType: 'Regular',
    };

    await getCasesByFilters({
      applicationContext,
      params: requestWithFilters,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query,
    ).toMatchObject({
      bool: {
        must: [
          {
            range: {
              'receivedAt.S': {
                gte: defaultStartDate,
                lt: defaultEndDate,
              },
            },
          },
          {
            terms: { 'status.S': ['Closed', 'General Docket - Not at Issue'] },
          },
          { terms: { 'caseType.S': ['Deficiency', 'Whistleblower'] } },
          { terms: { 'preferredTrialCity.S': ['Birmingham, Alabama'] } },
          {
            bool: {
              should: [
                {
                  match: {
                    'associatedJudge.S': {
                      operator: 'and',
                      query: 'Buch',
                    },
                  },
                },
              ],
            },
          },
          { match: { 'isPaper.BOOL': true } },
          { terms: { 'procedureType.S': ['Regular'] } },
          { match: { 'highPriority.BOOL': true } },
        ],
      },
    });
    expect(mockFormatResults).toHaveBeenCalled();
  });

  it('should return the last case id returned from persistence', async () => {
    applicationContext
      .getSearchClient()
      .search.mockReturnValueOnce(mockCaseSearchResult);
    const result = await getCasesByFilters({
      applicationContext,
      params: defaultRequest,
    });

    expect(mockFormatResults).toHaveBeenCalled();

    expect(result.lastCaseId).toEqual({
      pk: 'case|101-23',
      receivedAt: 1678746212843,
    });
  });
});
