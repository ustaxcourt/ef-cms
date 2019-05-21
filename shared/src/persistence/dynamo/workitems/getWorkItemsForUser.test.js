const sinon = require('sinon');
const { getWorkItemsForUser } = require('./getWorkItemsForUser');

const MOCK_ITEM = {
  caseStatus: 'New',
  docketNumber: '123-19',
};

describe('getWorkItemsForUser', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub().returns({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              'aws:rep:deleting': 'a',
              'aws:rep:updateregion': 'b',
              'aws:rep:updatetime': 'c',
              ...MOCK_ITEM,
            },
          ],
        }),
    });
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
      isAuthorizedForWorkItems: () => {
        return true;
      },
    };
    const result = await getWorkItemsForUser({
      applicationContext,
    });
    expect(result).toMatchObject([MOCK_ITEM]);
  });
});
