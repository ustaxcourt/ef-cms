const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getDocumentQCServedForUser } = require('./getDocumentQCServedForUser');

describe('getDocumentQCServedForUser', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            completedAt: 'today',
            completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            isQC: true,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            completedByUserId: 'bob',
            isQC: true,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            isQC: false,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
            isQC: false,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      }),
    });
  });

  it('should filter out the work items returned from persistence to only have served documents', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getDocumentQCServedForUser({
      applicationContext,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(items).toEqual([
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        isQC: true,
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
