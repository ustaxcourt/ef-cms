const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getDocumentQCServedForSection,
} = require('./getDocumentQCServedForSection');

describe('getDocumentQCServedForSection', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            completedAt: 'today',
            isQC: true,
            section: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
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

  it('invokes the persistence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getDocumentQCServedForSection({
      applicationContext,
      section: 'docket',
    });
    expect(items).toEqual([
      {
        completedAt: 'today',
        isQC: true,
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
