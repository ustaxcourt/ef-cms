const {
  addExistingUserToCaseInteractor,
} = require('./addExistingUserToCaseInteractor');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');

describe('addExistingUserToCaseInteractor', () => {
  it('throws an unauthorized error on non admissionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if no user exists with that email', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .getUserByEmail.mockReturnValue(null);

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no user found with the provided email of');
  });

  it('throws an error if contact not found with name provided', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext.getPersistenceGateway().getUserByEmail.mockReturnValue({
      userId: '07d932a1-94e1-4b42-8090-20eedd90c8ac',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        contactPrimary: {},
      });

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow(
      'no contact primary found with that user name of Bob Ross',
    );
  });

  it('should call associateUserWithCase and updateCase with the updated email for the contact primary', async () => {
    const USER_ID = '07d932a1-94e1-4b42-8090-20eedd90c8ac';
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext.getPersistenceGateway().getUserByEmail.mockReturnValue({
      userId: USER_ID,
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          email: undefined,
          name: 'Bob Ross',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      });

    await addExistingUserToCaseInteractor({
      applicationContext,
      docketNumber: '101-20',
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase.mock
        .calls[0][0],
    ).toMatchObject({
      userId: USER_ID,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      contactPrimary: {
        email: UPDATED_EMAIL,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });
  });
});
