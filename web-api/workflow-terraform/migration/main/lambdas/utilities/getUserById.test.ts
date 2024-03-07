import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { docketClerk1User } from '@shared/test/mockUsers';
import { getUserById } from './getUserById';

const mockUser = {
  ...docketClerk1User,
  pk: `user|${docketClerk1User.userId}`,
  sk: `user|${docketClerk1User.userId}`,
};

describe('getUserById', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = {
      get: jest.fn().mockResolvedValueOnce({
        Item: mockUser,
      }),
    } as unknown as DynamoDBDocument;
  });

  it('should make a call to persistence to retrieve a user by userId', async () => {
    await getUserById(documentClient, docketClerk1User.userId);

    expect(documentClient.get).toHaveBeenCalledWith(
      expect.objectContaining({
        Key: {
          pk: `user|${docketClerk1User.userId}`,
          sk: `user|${docketClerk1User.userId}`,
        },
      }),
    );
  });

  it('should return the user record when found in persistence', async () => {
    const result = await getUserById(documentClient, docketClerk1User.userId);

    expect(result).toEqual(mockUser);
  });
});
