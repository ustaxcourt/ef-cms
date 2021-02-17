const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { addExistingUserToCase } = require('./addExistingUserToCase');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addExistingUserToCase', () => {
  it('throws an unauthorized error on non admissionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addExistingUserToCase({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
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
      addExistingUserToCase({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
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

    const caseEntity = new Case(
      { ...MOCK_CASE, contactPrimary: {} },
      { applicationContext },
    );

    await expect(
      addExistingUserToCase({
        applicationContext,
        caseEntity,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow(
      'no contact primary found with that user name of Bob Ross',
    );
  });

  it('should call associateUserWithCase and return the updated case with contact primary email', async () => {
    const USER_ID = '07d932a1-94e1-4b42-8090-20eedd90c8ac';
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext.getPersistenceGateway().getUserByEmail.mockReturnValue({
      userId: USER_ID,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          email: undefined,
          name: 'Bob Ross',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      },
      { applicationContext },
    );

    const updatedCase = await addExistingUserToCase({
      applicationContext,
      caseEntity,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase.mock
        .calls[0][0],
    ).toMatchObject({
      userId: USER_ID,
    });
    expect(updatedCase).toMatchObject({
      contactPrimary: {
        email: UPDATED_EMAIL,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });
  });
});
