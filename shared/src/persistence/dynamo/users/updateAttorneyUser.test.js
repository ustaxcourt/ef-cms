const { updateUserRecords } = require('./updateAttorneyUser');
const { User } = require('../../../business/entities/User');

describe('updateAttorneyUser', () => {
  let applicationContext;
  let putStub;
  let deleteStub;

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
        put: putStub,
      }),
    };
  });

  it('attempts to update a practitioner user to inactivePractitioner', async () => {
    const oldUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.practitioner,
      section: 'practitioner',
    };
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };
    await updateUserRecords({
      applicationContext,
      oldUser,
      updatedUser,
      userId,
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'practitioner|user',
        sk: userId,
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|user',
        sk: userId,
      },
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...updatedUser,
        userId,
      },
    });
    expect(deleteStub.mock.calls[1][0]).toMatchObject({
      Key: {
        pk: 'Test Practitioner|practitioner',
        sk: userId,
      },
    });
    expect(deleteStub.mock.calls[2][0]).toMatchObject({
      Key: {
        pk: 'practitioner|PT1234',
        sk: userId,
      },
    });
    expect(putStub.mock.calls[2][0]).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|Test Practitioner',
        sk: userId,
      },
    });
    expect(putStub.mock.calls[3][0]).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|PT1234',
        sk: userId,
      },
    });
  });
});
