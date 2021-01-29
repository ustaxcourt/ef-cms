const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  PETITIONS_SECTION,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const { updateUserEmail } = require('./updateUserEmail');

const mockUserId = '9b52c605-edba-41d7-b045-d5f992a499d3';

let mockUser = {
  name: 'Test User',
  role: ROLES.petitionsClerk,
  section: PETITIONS_SECTION,
  userId: mockUserId,
};

describe('updateUserEmail', () => {
  it('makes put request with the given user data for the matching user id', async () => {
    mockUser = {
      email: 'testing@gmail.com',
      pendingEmail: 'other@example.com',
    };

    applicationContext.getCognito().adminGetUser.mockImplementation(() => ({
      promise() {
        return { Username: '123' };
      },
    }));
    applicationContext
      .getCognito()
      .adminUpdateUserAttributes.mockImplementation(() => ({
        promise() {
          return {};
        },
      }));

    await updateUserEmail({
      applicationContext,
      user: mockUser,
    });

    expect(
      applicationContext.getCognito().adminUpdateUserAttributes.mock.calls[0][0]
        .UserAttributes,
    ).toEqual([
      {
        Name: 'email',
        Value: mockUser.pendingEmail,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ]);
  });
});
