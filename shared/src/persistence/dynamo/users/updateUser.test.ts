const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  PETITIONS_SECTION,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { updateUser } = require('./updateUser');

const mockUserId = '9b52c605-edba-41d7-b045-d5f992a499d3';

const mockUser = {
  name: 'Test User',
  role: ROLES.petitionsClerk,
  section: PETITIONS_SECTION,
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
        ...mockUser,
        pk: `user|${mockUserId}`,
        sk: `user|${mockUserId}`,
      },
    });
  });
});
