const {
  updateAttorneyUser,
  updateUserRecords,
} = require('./updateAttorneyUser');
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

  it('attempts to update a private practitioner user to inactivePractitioner', async () => {
    const oldUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
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
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'section|inactivePractitioner',
        sk: `user|${userId}`,
      }, //
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...updatedUser,
        userId,
      },
    });
    expect(deleteStub.mock.calls[1][0]).toMatchObject({
      Key: {
        pk: 'privatePractitioner|Test Private Practitioner',
        sk: `user|${userId}`,
      },
    });
    expect(deleteStub.mock.calls[2][0]).toMatchObject({
      Key: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${userId}`,
      },
    });
    expect(putStub.mock.calls[2][0]).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|Test Private Practitioner',
        sk: `user|${userId}`,
      },
    });
    expect(putStub.mock.calls[3][0]).toMatchObject({
      Item: {
        pk: 'inactivePractitioner|PT1234',
        sk: `user|${userId}`,
      },
    });
  });
});

describe('updateAttorneyUser', () => {
  let applicationContext;
  let putStub;
  let deleteStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: User.ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCognito: () => {
        throw new Error();
      },
      getDocumentClient: () => ({
        delete: deleteStub,
        get: getStub,
        put: putStub,
      }),
      logger: {
        error: jest.fn().mockReturnValue(null),
      },
    };
  });

  it('should log an error', async () => {
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updateAttorneyUser({
      applicationContext,
      user: updatedUser,
    });

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});

describe('updateAttorneyUser', () => {
  let applicationContext;
  let putStub;
  let deleteStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: User.ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCognito: () => ({
        adminGetUser: () => ({
          promise: () => null,
        }),
      }),
      getDocumentClient: () => ({
        delete: deleteStub,
        get: getStub,
        put: putStub,
      }),
      logger: {
        error: jest.fn().mockReturnValue(null),
      },
    };
  });

  it('should log an error', async () => {
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updateAttorneyUser({
      applicationContext,
      user: updatedUser,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});

describe('updateAttorneyUser - with a cognito response', () => {
  let applicationContext;
  let putStub;
  let deleteStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: User.ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCognito: () => ({
        adminGetUser: () => ({
          promise: () => ({
            Username: 'bob',
          }),
        }),
        adminUpdateUserAttributes: () => ({
          promise: () => null,
        }),
      }),
      getDocumentClient: () => ({
        delete: deleteStub,
        get: getStub,
        put: putStub,
      }),
      logger: {
        error: jest.fn().mockReturnValue(null),
      },
    };
  });

  it('should log an error', async () => {
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: User.ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updateAttorneyUser({
      applicationContext,
      user: updatedUser,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });
});
