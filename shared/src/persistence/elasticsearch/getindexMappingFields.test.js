const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getIndexMappingFields } = require('./getIndexMappingFields');

describe('getIndexMappingFields', () => {
  beforeAll(() => {
    const mockIndexes = { baz: { quux: 'quux!' }, foo: { bar: 'bar!' } };
    applicationContext.getSearchClient.mockReturnValue({
      indices: {
        getMapping: ({ index }) => ({
          efcms: { mappings: { properties: mockIndexes[index] } },
        }),
      },
    });
  });

  it('returns index mapping properties', async () => {
    const results = await getIndexMappingFields({
      applicationContext,
      index: 'foo',
    });
    expect(results).toMatchObject({ bar: 'bar!' });
  });
});
