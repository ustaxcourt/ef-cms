const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { ROLES } = require('../../../business/entities/EntityConstants');
const { updateUserRecords } = require('./updateUserRecords');

describe('updateUserRecords', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  const updatedUser = {
    barNumber: 'PT1234',
    name: 'Test Practitioner',
    role: ROLES.inactivePractitioner,
    section: 'inactivePractitioner',
  };

  beforeEach(() => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => null,
    });
  });

  it('should successfully update a private practitioner user to inactivePractitioner', async () => {
    const oldUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
      role: ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };

    await updateUserRecords({
      applicationContext,
      oldUser,
      updatedUser,
      userId,
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        ...updatedUser,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        userId,
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: 'privatePractitioner|Test Private Practitioner',
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[2][0],
    ).toMatchObject({
      Key: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|Test Practitioner',
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|PT1234',
        sk: `user|${userId}`,
      },
    });
  });
});
