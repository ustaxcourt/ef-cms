const sinon = require('sinon');
const { getAllCatalogCases } = require('./getAllCatalogCases');

describe('getAllCatalogCases', () => {
  let applicationContext;
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub().returns({
      promise: () =>
        Promise.resolve({
          Items: [],
        }),
    });

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };
  });

  it('should return empty array if there are no records returned from persistence', async () => {
    const result = await getAllCatalogCases({
      applicationContext,
    });
    expect(result).toEqual([]);
  });

  it('should return records from persistence', async () => {
    queryStub = sinon.stub().returns({
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
