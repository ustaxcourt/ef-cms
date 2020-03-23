const { updateUser } = require('./updateUser');
const { User } = require('../../../business/entities/User');

describe('updateUser', () => {
  let applicationContext;
  let putStub;

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('makes put request with the given user data for the matching user id', async () => {
    const user = {
      name: 'Test User',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
      userId,
    };
    await updateUser({
      applicationContext,
      user,
    });

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...user,
      },
    });
  });
});
