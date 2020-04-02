const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getSentMessagesForSection } = require('./getSentMessagesForSection');

describe('getSentMessagesForSection', () => {
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            completedAt: 'today',
            completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            isQC: true,
            sentBySection: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            completedByUserId: 'bob',
            isQC: true,
            sentBySection: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: 'today',
            isQC: false,
            section: 'docket',
            sentBySection: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            completedAt: null,
            isQC: false,
            sentBySection: 'docket',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      }),
    });
  });

  it('should filter out the work items returned from persistence to only have sent work items for a section', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: 'docket',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getSentMessagesForSection({
      applicationContext,
      section: 'docket',
    });
    expect(items).toEqual([
      {
        completedAt: null,
        isQC: false,
        sentBySection: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
