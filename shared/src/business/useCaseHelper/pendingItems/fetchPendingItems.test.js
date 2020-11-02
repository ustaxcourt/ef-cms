const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { fetchPendingItems } = require('./fetchPendingItems');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('fetchPendingItems', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  beforeEach(() => {
    const mockData = {
      results: [
        {
          docketEntryId: 'def',
        },
        {
          docketEntryId: 'abc',
        },
      ],
      total: 2,
    };

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue(mockData);
  });

  it('calls search function with correct params when provided a judge and returns records', async () => {
    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
      judge: 'Judge Colvin',
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();

    expect(foundDocuments).toMatchObject([
      { docketEntryId: 'def' },
      { docketEntryId: 'abc' },
    ]);
    expect(total).toBe(2);
  });

  it('calls search function with correct params when not provided a judge and returns records', async () => {
    const { foundDocuments } = await fetchPendingItems({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();

    expect(foundDocuments).toMatchObject([
      { docketEntryId: 'def' },
      { docketEntryId: 'abc' },
    ]);
  });

  it('returns an empty array when no hits are returned from the search client', async () => {
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue({ results: [], total: 0 });

    const { foundDocuments, total } = await fetchPendingItems({
      applicationContext,
    });

    expect(total).toEqual(0);
    expect(foundDocuments.length).toEqual(0);
    expect(foundDocuments).toMatchObject([]);
  });
});
