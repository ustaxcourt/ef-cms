const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserByEmail } = require('./getUserByEmail');
jest.mock('./getUserById');
const { getUserById } = require('./getUserById');

describe('getUserByEmail', () => {
  beforeAll(() => {
    client.query = jest.fn();
  });

  it('should return undefined when a user is not found with the provided email', async () => {
    const mockEmail = 'notfound@example.com';

    const result = await getUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeUndefined();
  });

  it('should format the provided email by removing whitespace and transforming to lowercase', async () => {
    const mockEmail = 'FOUND@example.com   ';

    await getUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(
      client.query.mock.calls[0][0].ExpressionAttributeValues[':pk'],
    ).toEqual('user-email|found@example.com');
  });

  it('should return a user object when one is found with the email provided', async () => {
    const mockEmail = 'found@example.com';
    const mockFoundUser = {
      email: mockEmail,
      userId: 'petitioner1',
    };
    client.query = jest.fn().mockReturnValue([
      {
        userId: mockFoundUser.userId,
      },
    ]);
    getUserById.mockReturnValue(mockFoundUser);

    const result = await getUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBe(mockFoundUser);
  });
});
