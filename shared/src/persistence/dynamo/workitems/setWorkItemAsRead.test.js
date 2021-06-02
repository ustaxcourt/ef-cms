const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { setWorkItemAsRead } = require('./setWorkItemAsRead');

describe('setWorkItemAsRead', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of work-item|{workItemId} and other expected params', async () => {
    await setWorkItemAsRead({
      applicationContext,
      workItemId: 'abc',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'work-item|abc',
        sk: 'work-item|abc',
      },
    });
  });
});
