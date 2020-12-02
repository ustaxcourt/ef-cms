const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { fetchPendingItems } = require('./fetchPendingItems');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('fetchPendingItems', () => {
  it('returns results from a query without judge', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });
    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
    });

    expect(foundDocuments).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery.length).toBe(5);
  });

  it('returns results from a query with a judge', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });

    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
      judge: 'Dredd',
    });

    expect(foundDocuments).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery[3].has_parent.query.bool.must[0]).toMatchObject({
      match_phrase: { 'associatedJudge.S': 'Dredd' },
    });
  });

  it('queries documents with a defined servedAt field or isLegacyServed field true', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 2 });
    await fetchPendingItems({
      applicationContext,
      judge: 'Dredd',
    });

    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery[4]).toMatchObject({
      bool: {
        minimum_should_match: 1,
        should: [
          {
            exists: {
              field: 'servedAt',
            },
          },
          {
            term: {
              'isLegacyServed.BOOL': true,
            },
          },
        ],
      },
    });
  });
});
