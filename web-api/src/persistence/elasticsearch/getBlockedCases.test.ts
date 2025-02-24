import { getBlockedCases } from './getBlockedCases';
jest.mock('./searchClient');
import { search as searchMock } from './searchClient';

describe('getBlockedCases', () => {
  const search = jest.mocked(searchMock);
  it('returns results when searching with a trialLocation', async () => {
    search.mockResolvedValue({ results: ['some', 'matches'], total: 0 });

    const results = await getBlockedCases({
      trialLocation: 'Memphis, TN',
    });

    expect(results).toMatchObject(['some', 'matches']);
    expect(search).toHaveBeenCalledTimes(2);
  });
});
