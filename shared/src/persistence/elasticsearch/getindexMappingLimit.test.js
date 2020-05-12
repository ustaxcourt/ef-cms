const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getIndexMappingLimit } = require('./getIndexMappingLimit');

describe('getIndexMappingLimit', () => {
  beforeAll(() => {
    applicationContext.getSearchClient.mockReturnValue({
      indices: {
        getSettings: () => ({
          efcms: {
            settings: { index: { mapping: { total_fields: { limit: 479 } } } },
          },
        }),
      },
    });
  });

  it('returns index mapping limit', async () => {
    const results = await getIndexMappingLimit({
      applicationContext,
    });
    expect(results).toEqual(479);
  });
});
