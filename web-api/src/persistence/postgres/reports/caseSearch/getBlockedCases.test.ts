import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getBlockedCasesForTrialLocation } from './getBlockedCasesForTrialLocation';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getBlockedCases', () => {
  it('returns results when searching with a trialLocation', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getBlockedCasesForTrialLocation({
      applicationContext,
      trialLocation: 'Memphis, TN',
    });

    expect(results).toMatchObject(['some', 'matches']);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery[0]).toMatchObject({
      term: { 'preferredTrialCity.S': 'Memphis, TN' },
    });
  });
});
