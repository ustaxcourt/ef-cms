const sinon = require('sinon');
const { getDocumentQCServedForUser } = require('./getDocumentQCServedForUser');

describe('getDocumentQCServedForUser', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub().returns({
      promise: async () => ({
        Items: [
          {
            completedAt: 'today',
            completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            isInternal: false,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            completedByUserId: 'bob',
            isInternal: false,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            isInternal: true,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
            isInternal: true,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      }),
    });
  });

  it('should filter out the work items returned from persistence to only have served documents', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };
    const items = await getDocumentQCServedForUser({
      applicationContext,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(items).toEqual([
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        isInternal: false,
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
