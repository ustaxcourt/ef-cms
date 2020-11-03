const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { fetchPendingItems } = require('./fetchPendingItems');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('fetchPendingItems', () => {
  it('returns results a query without judge', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });
    const { results, total } = await fetchPendingItems({
      applicationContext,
    });

    expect(results).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery.length).toBe(5);
  });

  it('returns results a query with a judge', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });
    const { results, total } = await fetchPendingItems({
      applicationContext,
      judge: 'Dredd',
    });

    expect(results).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery[4].has_parent.query.bool.must[0]).toMatchObject({
      match_phrase: { 'associatedJudge.S': 'Dredd' },
    });
  });
});
