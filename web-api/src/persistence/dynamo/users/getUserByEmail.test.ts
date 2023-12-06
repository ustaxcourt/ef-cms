import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserByEmail } from './getUserByEmail';
import { getUserById } from './getUserById';
import { query } from '../../dynamodbClientService';

jest.mock('./getUserById', () => ({
  getUserById: jest.fn(),
}));

const getUserByIdMock = getUserById as jest.Mock;
let mockEmail = 'found@example.com';
const mockFoundUser = {
  email: mockEmail,
  userId: 'petitioner1',
};

jest.mock('../../dynamodbClientService', () => ({
  query: jest.fn().mockImplementation(() => {
    return [
      {
        userId: mockFoundUser.userId,
      },
    ];
  }),
}));

describe('getUserByEmail', () => {
  it('should return undefined when a user is not found with the provided email', async () => {
    mockEmail = 'notfound@example.com';

    const result = await getUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeUndefined();
  });

  it('should format the provided email by removing whitespace and transforming to lowercase', async () => {
    const mockUglyEmail = 'FOUND@example.com   ';

    await getUserByEmail({
      applicationContext,
      email: mockUglyEmail,
    });

    expect(
      (query as jest.Mock).mock.calls[0][0].ExpressionAttributeValues[':pk'],
    ).toEqual('user-email|found@example.com');
  });

  it('should return a user object when one is found with the email provided', async () => {
    getUserByIdMock.mockReturnValue(mockFoundUser);

    const result = await getUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBe(mockFoundUser);
  });
});
