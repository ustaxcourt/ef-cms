import {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  Case,
  getContactPrimary,
} from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { addExistingUserToCase } from './addExistingUserToCase';
import { admissionsClerkUser, petitionerUser } from '@shared/test/mockUsers';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

describe('addExistingUserToCase', () => {
  const mockUserId = '674fdded-1d17-4081-b9fa-950abc677cee';
  const mockContactId = '60dd21b3-5abb-447f-b036-9794962252a0';
  const mockUpdatedEmail = 'testing@example.com';

  beforeEach(() => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue({
      userId: mockUserId,
    });

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      userId: mockUserId,
    });
  });

  it('should throw an unauthorized error when the user is not authorized to add a user to a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      addExistingUserToCase({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
        contactId: mockContactId,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when a user is NOT found with the provided email', async () => {
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue(null);

    await expect(
      addExistingUserToCase({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
        contactId: mockContactId,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no user found with the provided email of');
  });

  it('should throw an error when a contact is NOT found with name provided', async () => {
    const mockExistingUser = {
      contactId: '60dd21b3-5abb-447f-b036-9794962252a0',
      contactType: CONTACT_TYPES.primary,
    };
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
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
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
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

    await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase.mock
        .calls[0][0],
    ).toMatchObject({
      userId: mockUserId,
    });
    expect(getContactPrimary(caseEntity)).toMatchObject({
      contactId: mockUserId, // contactId was updated to new userId
      email: mockUpdatedEmail,
      hasEAccess: true,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should call associateUserWithCase and update the representing arrays entries with the expect contactId', async () => {
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
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

    await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(caseEntity.privatePractitioners?.[0].representing).toEqual([
      mockUserId,
    ]);
  });

  it("should not update the practitioner's representing array when the cognito user's ID already exists", async () => {
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
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
            representing: [mockUserId],
            role: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
          },
        ],
      },
      { applicationContext },
    );

    await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(caseEntity.privatePractitioners?.[0].representing).toEqual([
      mockUserId,
    ]);
  });

  it('should not change the service indicator to electronic when the user has a pendingEmail', async () => {
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      pendingEmail: 'testing@example.com',
      userId: mockUserId,
    });
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockContactId,
            email: undefined,
            hasEAccess: false,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await addExistingUserToCase({
      applicationContext,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(getContactPrimary(caseEntity)).toMatchObject({
      contactId: mockUserId, // contactId was updated to new userId
      email: undefined,
      hasEAccess: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });
  });
});
