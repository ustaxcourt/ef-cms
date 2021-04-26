const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { addExistingUserToCase } = require('./addExistingUserToCase');
const { Case, getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addExistingUserToCase', () => {
  const USER_ID = '674fdded-1d17-4081-b9fa-950abc677cee';
  const mockContactId = '60dd21b3-5abb-447f-b036-9794962252a0';
  const UPDATED_EMAIL = 'testing@example.com';

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
    const mockExistingUser = {
      contactId: '60dd21b3-5abb-447f-b036-9794962252a0',
      contactType: CONTACT_TYPES.primary,
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      { ...MOCK_CASE, petitioners: [mockExistingUser] },
      { applicationContext },
    );

    await expect(
      addExistingUserToCase({
        applicationContext,
        caseEntity,
        contactId: mockExistingUser.contactId,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no contact found with that user name of Bob Ross');
  });

  it('should call associateUserWithCase and return the updated case with contact primary email', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockContactId,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    const updatedCase = await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase.mock
        .calls[0][0],
    ).toMatchObject({
      userId: USER_ID,
    });
    expect(getContactPrimary(updatedCase)).toMatchObject({
      contactId: USER_ID, // contactId was updated to new userId
      email: UPDATED_EMAIL,
      hasEAccess: true,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should call associateUserWithCase and return the updated case with contact primary email', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockContactId,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [
          {
            barNumber: 'OK0063',
            contact: {
              address1: '5943 Joseph Summit',
              address2: 'Suite 334',
              address3: null,
              city: 'Millermouth',
              country: 'U.S.A.',
              countryType: 'domestic',
              phone: '348-858-8312',
              postalCode: '99517',
              state: 'AK',
            },
            email: 'thomastorres@example.com',
            entityName: 'PrivatePractitioner',
            name: 'Brandon Choi',
            representing: [mockContactId],
            role: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
          },
        ],
      },
      { applicationContext },
    );

    const updatedCase = await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(updatedCase.privatePractitioners[0].representing).toEqual([USER_ID]);
  });

  it("should not update the practitioner's representing array if the cognito user's ID already exists", async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockContactId,
            email: undefined,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [
          {
            barNumber: 'OK0063',
            contact: {
              address1: '5943 Joseph Summit',
              address2: 'Suite 334',
              address3: null,
              city: 'Millermouth',
              country: 'U.S.A.',
              countryType: 'domestic',
              phone: '348-858-8312',
              postalCode: '99517',
              state: 'AK',
            },
            email: 'thomastorres@example.com',
            entityName: 'PrivatePractitioner',
            name: 'Brandon Choi',
            representing: [USER_ID],
            role: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
          },
        ],
      },
      { applicationContext },
    );

    const updatedCase = await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(updatedCase.privatePractitioners[0].representing).toEqual([USER_ID]);
  });
});
