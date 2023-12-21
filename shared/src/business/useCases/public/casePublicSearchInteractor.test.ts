import { CaseAdvancedSearchParamsRequestType } from '@shared/business/useCases/caseAdvancedSearchInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { casePublicSearchInteractor } from './casePublicSearchInteractor';

describe('casePublicSearchInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .casePublicSearch.mockReturnValue({
        results: [],
      });
  });

  it('make a public case search request with formatted dates', async () => {
    const requestParams: CaseAdvancedSearchParamsRequestType = {
      countryType: 'domestic',
      endDate: '12/20/2023',
      petitionerName: 'test person',
      petitionerState: 'New York', // check if correct state type
      startDate: '01/01/2001',
    };

    await casePublicSearchInteractor(applicationContext, requestParams as any);

    expect(
      applicationContext.getPersistenceGateway().casePublicSearch,
    ).toHaveBeenCalledWith({
      applicationContext,
      searchTerms: {
        ...requestParams,
        endDate: '2023-12-21T04:59:59.999Z',
        startDate: '2001-01-01T05:00:00.000Z',
      },
    });
  });
});
