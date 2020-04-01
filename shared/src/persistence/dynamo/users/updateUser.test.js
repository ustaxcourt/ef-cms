const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateUser } = require('./updateUser');
const { User } = require('../../../business/entities/User');

const mockUserId = '9b52c605-edba-41d7-b045-d5f992a499d3';

const mockUser = {
  name: 'Test User',
  role: User.ROLES.petitionsClerk,
  section: 'petitions',
  userId: mockUserId,
};

describe('updateUser', () => {
  it('makes put request with the given user data for the matching user id', async () => {
    await updateUser({
      applicationContext,
      user: mockUser,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `user|${mockUserId}`,
        sk: `user|${mockUserId}`,
        ...mockUser,
      },
    });
  });
});
