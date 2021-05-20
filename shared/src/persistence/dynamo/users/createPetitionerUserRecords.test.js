const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createPetitionerUserRecords,
} = require('./createPetitionerUserRecords');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('createPetitionerUserRecords', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const petitionerUser = {
    email: 'petitioner@example.com',
    name: 'Test Petitioner',
    role: ROLES.petitioner,
  };

  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('attempts to persist a petitioner user record with an email mapping record', async () => {
    await createPetitionerUserRecords({
      applicationContext,
      user: petitionerUser,
      userId,
    });

    expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
      2,
    );
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        ...petitionerUser,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        userId,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: `user-email|${petitionerUser.email}`,
        sk: `user|${userId}`,
        userId,
      },
    });
  });
});
