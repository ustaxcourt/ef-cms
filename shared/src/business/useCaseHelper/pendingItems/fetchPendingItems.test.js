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
    };

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue(mockData);
  });

  it('calls search function with correct params when provided a judge and returns records', async () => {
    const { foundDocuments } = await fetchPendingItems({
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
      .fetchPendingItems.mockReturnValue({ results: [] });

    const { foundDocuments } = await fetchPendingItems({
      applicationContext,
    });

    expect(foundDocuments.length).toEqual(0);
    expect(foundDocuments).toMatchObject([]);
  });
});
