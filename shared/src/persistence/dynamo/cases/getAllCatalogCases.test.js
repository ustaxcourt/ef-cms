const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getAllCatalogCases } = require('./getAllCatalogCases');

describe('getAllCatalogCases', () => {
  it('should return empty array if there are no records returned from persistence', async () => {
    const result = await getAllCatalogCases({
      applicationContext,
    });
    expect(result).toEqual([]);
  });

  it('should return records from persistence', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: 'catalog',
              sk: 'case',
            },
          ],
        }),
    });
    const result = await getAllCatalogCases({
      applicationContext,
    });
    expect(result).toBeDefined();
  });
});
