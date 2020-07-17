const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getIndexMappingFields } = require('./getIndexMappingFields');

describe('getIndexMappingFields', () => {
  beforeAll(() => {
    const mockIndexes = {
      'efcms-documents': { quux: 'quux!' },
      foo: { bar: 'bar!' },
    };
    applicationContext.getSearchClient.mockReturnValue({
      indices: {
        getMapping: ({ index }) => ({
          'efcms-documents': { mappings: { properties: mockIndexes[index] } },
        }),
      },
    });
  });

  it('returns index mapping properties', async () => {
    const results = await getIndexMappingFields({
      applicationContext,
      index: 'efcms-documents',
    });
    expect(results).toMatchObject({ quux: 'quux!' });
  });

  it('returns undefined index mapping properties', async () => {
    const results = await getIndexMappingFields({
      applicationContext,
      index: 'this-index-does-not-exist',
    });
    expect(results).toBeUndefined();
  });
});
