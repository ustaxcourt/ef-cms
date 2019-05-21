const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getWorkItemsBySection } = require('./getWorkItemsBySection');

const MOCK_ITEM = {
  docketNumber: '123-19',
  status: 'New',
};

describe('getWorkItemsBySection', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub().returns({
      promise: async () => ({
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
    const result = await getWorkItemsBySection({
      applicationContext,
    });
    expect(result).toMatchObject([MOCK_ITEM]);
  });
});
