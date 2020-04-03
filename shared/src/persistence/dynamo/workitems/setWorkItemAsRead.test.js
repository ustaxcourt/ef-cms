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

  it('invokes the persistence layer with pk of {userId}|workItem and other expected params', async () => {
    await setWorkItemAsRead({
      applicationContext,
      userId: '123',
      workItemId: 'abc',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'user|123',
        sk: 'work-item|abc',
      },
    });
  });
});
