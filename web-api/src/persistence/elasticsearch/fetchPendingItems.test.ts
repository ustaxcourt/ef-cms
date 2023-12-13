import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { fetchPendingItems } from './fetchPendingItems';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('fetchPendingItems', () => {
  it('returns results from a query without judge', async () => {
    (search as any).mockReturnValue({ results: ['some', 'matches'], total: 2 });
    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
    });

    expect(foundDocuments).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery = (search as any).mock.calls[0][0].searchParameters.body
      .query.bool.must;
    expect(searchQuery.length).toBe(4);
  });

  it('returns results from a query with a judge', async () => {
    (search as any).mockReturnValue({ results: ['some', 'matches'], total: 2 });

    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
      judge: 'Dredd',
    });

    expect(foundDocuments).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery = (search as any).mock.calls[0][0].searchParameters.body
      .query.bool.must;
    expect(searchQuery[2].has_parent.query.bool.must[0]).toMatchObject({
      match_phrase: { 'associatedJudge.S': 'Dredd' },
    });
  });

  it('returns results from a query with a docketNumber', async () => {
    (search as any).mockReturnValue({ results: ['some', 'matches'], total: 2 });

    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
      docketNumber: '4',
      judge: 'Dredd',
    });

    expect(foundDocuments).toMatchObject(['some', 'matches']);
    expect(total).toBe(2);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery = (search as any).mock.calls[0][0].searchParameters.body
      .query.bool.must;
    expect(searchQuery[3].term).toMatchObject({
      'docketNumber.S': '4',
    });
  });

  it('queries documents with a defined servedAt field or isLegacyServed field true', async () => {
    (search as any).mockReturnValue({ results: ['some', 'matches'], total: 2 });
    await fetchPendingItems({
      applicationContext,
      judge: 'Dredd',
    });

    const searchQuery = (search as any).mock.calls[0][0].searchParameters.body
      .query.bool.must[3].bool.should;

    expect(searchQuery[0]).toMatchObject({
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

    expect(searchQuery[1]).toMatchObject({
      terms: { 'eventCode.S': expect.anything() },
    });
  });

  it('uses page passed in to calculate `size` and `from` values for query', async () => {
    applicationContext.getConstants.mockReturnValue({
      PENDING_ITEMS_PAGE_SIZE: 2,
    });

    await fetchPendingItems({
      applicationContext,
      page: 2,
    });

    expect((search as any).mock.calls[0][0].searchParameters.body.from).toBe(4);
    expect((search as any).mock.calls[0][0].searchParameters.body.size).toBe(2);
  });

  it('returns results sorted by receivedAt date', async () => {
    (search as any).mockReturnValue({ results: ['some', 'matches'], total: 2 });

    await fetchPendingItems({
      applicationContext,
    });

    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery = (search as any).mock.calls[0][0].searchParameters.body
      .sort;

    expect(searchQuery).toBeDefined();

    expect(searchQuery[0]).toMatchObject({
      'receivedAt.S': { order: 'asc' },
    });
    expect(searchQuery[1]).toMatchObject({
      'docketEntryId.S': { order: 'asc' },
    });
  });
});
