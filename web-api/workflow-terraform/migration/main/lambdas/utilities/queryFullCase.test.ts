import { queryFullCase } from './queryFullCase';

describe('queryFullCase', () => {
  let documentClient;
  const item1 = { item: 'one' };
  const item2 = { item: 'two' };

  beforeEach(() => {
    documentClient = {
      query: jest
        .fn()
        .mockResolvedValueOnce({
          Items: [item1],
          LastEvaluatedKey: '1',
        })
        .mockResolvedValueOnce({
          Items: [item2],
          LastEvaluatedKey: null,
        }),
    };
  });

  it('calls the documentClient query method to fetch case items for the given docket number', async () => {
    await queryFullCase(documentClient, '101-21');

    expect(documentClient.query).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeValues: {
          ':pk': 'case|101-21',
        },
      }),
    );
  });

  it('returns all aggregated results from the query', async () => {
    const results = await queryFullCase(documentClient, '101-21');

    expect(results).toEqual([item1, item2]);
  });
});
