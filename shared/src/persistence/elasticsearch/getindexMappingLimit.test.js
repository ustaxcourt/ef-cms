const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getIndexMappingLimit } = require('./getIndexMappingLimit');

describe('getIndexMappingLimit', () => {
  beforeAll(() => {
    applicationContext.getSearchClient.mockReturnValue({
      indices: {
        getSettings: () => ({
          'efcms-documents': {
            settings: {
              index: { mapping: { total_fields: { limit: 479 } } },
            },
          },
        }),
      },
    });
  });

  it('returns index mapping limit of an index which is present in settings ', async () => {
    const results = await getIndexMappingLimit({
      applicationContext,
      index: 'efcms-documents',
    });
    expect(results).toEqual(479);
  });

  it('throws an error if index info cannot be found', async () => {
    await expect(
      getIndexMappingLimit({
        applicationContext,
        index: 'bbq',
      }),
    ).rejects.toThrow();
  });
});
