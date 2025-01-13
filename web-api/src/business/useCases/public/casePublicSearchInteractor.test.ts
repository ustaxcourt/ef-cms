import '@web-api/persistence/postgres/cases/mocks.jest';
import { CaseAdvancedSearchTerms } from '@web-api/persistence/postgres/cases/reports/caseAdvancedSearch';
import { casePublicSearchInteractor } from '@web-api/business/useCases/public/casePublicSearchInteractor';
import { casePublicSearch as casePublicSearchMock } from '@web-api/persistence/postgres/cases/reports/casePublicSearch';

describe('casePublicSearchInteractor', () => {
  const casePublicSearch = casePublicSearchMock as jest.Mock;

  it('make a public case search request with formatted dates', async () => {
    casePublicSearch.mockResolvedValue([]);

    const requestParams: CaseAdvancedSearchTerms = {
      countryType: 'domestic',
      endDate: '12/20/2023',
      petitionerName: 'test person',
      petitionerState: 'NY',
      startDate: '01/01/2001',
    };

    await casePublicSearchInteractor(requestParams as any);

    expect(casePublicSearch).toHaveBeenCalledWith({
      searchTerms: {
        ...requestParams,
        endDate: '2023-12-21T04:59:59.999Z',
        startDate: '2001-01-01T05:00:00.000Z',
      },
    });
  });
});
