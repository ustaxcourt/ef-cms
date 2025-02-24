jest.mock('@web-api/persistence/elasticsearch/casePublicSearch', () => ({
  casePublicSearch: jest.fn(),
}));
import '@web-api/persistence/postgres/cases/mocks.jest';
import { casePublicSearchInteractor } from '@web-api/business/useCases/public/casePublicSearchInteractor';
import { casePublicSearch as casePublicSearchMock } from '@web-api/persistence/elasticsearch/casePublicSearch';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';

const casePublicSearch = casePublicSearchMock as jest.Mock;
casePublicSearch.mockResolvedValue([]);

describe('casePublicSearchInteractor', () => {
  it('make a public case search request with formatted dates', async () => {
    const requestParams = {
      countryType: 'domestic',
      endDate: '12/20/2023',
      petitionerName: 'test person',
      petitionerState: 'NY',
      startDate: '01/01/2001',
      caseType: { [CASE_TYPES_MAP.cdp]: CASE_TYPES_MAP.cdp },
    };

    await casePublicSearchInteractor(applicationContext, requestParams as any);

    expect(casePublicSearch).toHaveBeenCalledWith({
      applicationContext,
      searchTerms: {
        ...requestParams,
        endDate: '2023-12-21T04:59:59.999Z',
        startDate: '2001-01-01T05:00:00.000Z',
      },
    });
  });
});
