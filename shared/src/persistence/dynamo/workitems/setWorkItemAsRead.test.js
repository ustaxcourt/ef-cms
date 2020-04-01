const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { setWorkItemAsRead } = require('./setWorkItemAsRead');

describe('setWorkItemAsRead', () => {
  let updateStub;

  beforeEach(() => {
    updateStub = jest.fn().mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {userId}|workItem and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      update: updateStub,
    });
    await setWorkItemAsRead({
      applicationContext,
      userId: '123',
      workItemId: 'abc',
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user|123',
        sk: 'work-item|abc',
      },
    });
  });
});
