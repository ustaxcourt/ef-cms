const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
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
            section: DOCKET_SECTION,
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
            section: DOCKET_SECTION,
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            section: DOCKET_SECTION,
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
            section: DOCKET_SECTION,
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      }),
    });
  });

  it('invokes the persistence layer with pk of {userId}|outbox and {section}|outbox and other expected params', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getDocumentQCServedForSection({
      applicationContext,
      section: DOCKET_SECTION,
    });
    expect(items).toEqual([
      {
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
