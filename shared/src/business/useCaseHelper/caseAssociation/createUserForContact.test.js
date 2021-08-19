const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { Case, getContactPrimary } = require('../../entities/cases/Case');
const { createUserForContact } = require('./createUserForContact');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('createUserForContact', () => {
  const USER_ID = '674fdded-1d17-4081-b9fa-950abc677cee';

  beforeEach(() => {
    applicationContext.getUniqueId.mockReturnValue(USER_ID);
  });

  it('should throw an unauthorized error for non admissionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      createUserForContact({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
        contactId: USER_ID,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call createNewPetitionerUser with the new user entity', async () => {
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: USER_ID,
            contactType: CONTACT_TYPES.primary,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await createUserForContact({
      applicationContext,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().createNewPetitionerUser.mock
        .calls[0][0].user,
    ).toMatchObject({
      contact: {},
      name: 'Bob Ross',
      pendingEmail: UPDATED_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
    });
  });

  it('should return the caseEntity', async () => {
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: USER_ID,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    const updatedCase = await createUserForContact({
      applicationContext,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(updatedCase).toMatchObject(caseEntity);
  });

  it('should call associateUserWithCase', async () => {
    const UPDATED_EMAIL = 'testing@example.com';

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: USER_ID,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await createUserForContact({
      applicationContext,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: caseEntity.docketNumber,
      userId: USER_ID,
    });
  });
});
