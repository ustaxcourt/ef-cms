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
  const USER_ID = '674fdded-1d17-4081-b9fa-950abc677cee';

  beforeEach(() => {
    const mockUser = {
      userId: USER_ID,
    };

    applicationContext
      .getPersistenceGateway()
      .getCognitoUserIdByEmail.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);
  });

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
      .getCognitoUserIdByEmail.mockReturnValue(null);

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
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          contactId: '123',
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
        contactId: USER_ID, // contactId was updated to new userId
        email: UPDATED_EMAIL,
        hasEAccess: true,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });
  });
});
