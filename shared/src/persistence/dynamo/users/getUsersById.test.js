const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUsersById } = require('./getUsersById');

const mockUser1 = {
  contact: {},
  name: 'Guy Fieri',
  pendingEmail: 'pending@example.com',
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};

const mockUser2 = {
  contact: {},
  name: 'Guy Fieri',
  pendingEmail: 'pending2@example.com',
  userId: 'a805d1ab-18d0-43ec-bafb-654e83405412',
};

const mockUserIds = [
  '6805d1ab-18d0-43ec-bafb-654e83405416',
  '6805d1ab-18d0-43ec-bafb-654e83405416',
  'a805d1ab-18d0-43ec-bafb-654e83405412',
];

describe('getUsersById', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        ...mockUser1,
        pk: `user|${mockUser1.userId}`,
        sk: `user|${mockUser1.userId}`,
      },
      {
        ...mockUser2,
        pk: `user|${mockUser2.userId}`,
        sk: `user|${mockUser2.userId}`,
      },
    ]);
  });

  it('should return data as received from persistence with unique userIds', async () => {
    const result = await getUsersById({
      applicationContext,
      userIds: mockUserIds,
    });

    expect(result).toEqual([
      {
        ...mockUser1,
        pk: `user|${mockUser1.userId}`,
        sk: `user|${mockUser1.userId}`,
      },
      {
        ...mockUser2,
        pk: `user|${mockUser2.userId}`,
        sk: `user|${mockUser2.userId}`,
      },
    ]);
  });
});
