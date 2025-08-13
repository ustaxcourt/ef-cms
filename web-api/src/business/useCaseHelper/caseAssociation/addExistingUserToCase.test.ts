jest.mock('@web-api/persistence/postgres/users/getUserById');
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
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockAdmissionsClerkUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { petitionerUser } from '@shared/test/mockUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('addExistingUserToCase', () => {
  const mockUserId = '674fdded-1d17-4081-b9fa-950abc677cee';
  const mockContactId = '60dd21b3-5abb-447f-b036-9794962252a0';
  const mockUpdatedEmail = 'testing@example.com';
  const getUserById = jest.mocked(getUserByIdMock);

  beforeEach(() => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue({
      userId: mockUserId,
    });

    getUserById.mockResolvedValue({
      ...petitionerUser,
      userId: mockUserId,
    } as DbUser);
  });

  it('should throw an unauthorized error when the user is not authorized to add a user to a case', async () => {
    await expect(
      addExistingUserToCase({
        applicationContext,
        authorizedUser: mockPetitionerUser,
        caseEntity: new Case(MOCK_CASE, {
          authorizedUser: mockDocketClerkUser,
        }),
        contactId: mockContactId,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when a user is NOT found with the provided email', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue(null);

    await expect(
      addExistingUserToCase({
        applicationContext,
        authorizedUser: mockAdmissionsClerkUser,
        caseEntity: new Case(MOCK_CASE, {
          authorizedUser: mockDocketClerkUser,
        }),
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
    const caseEntity = new Case(
      { ...MOCK_CASE, petitioners: [mockExistingUser] },
      { authorizedUser: mockDocketClerkUser },
    );

    await expect(
      addExistingUserToCase({
        applicationContext,
        authorizedUser: mockAdmissionsClerkUser,
        caseEntity,
        contactId: mockExistingUser.contactId,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no contact found with that user name of Bob Ross');
  });

  it('should return the updated case with contact primary email', async () => {
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
      { authorizedUser: mockDocketClerkUser },
    );

    await addExistingUserToCase({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(getContactPrimary(caseEntity)).toMatchObject({
      contactId: mockUserId, // contactId was updated to new userId
      email: mockUpdatedEmail,
      hasElectronicAccess: true,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('should update the representing arrays entries with the expect contactId', async () => {
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
      { authorizedUser: mockDocketClerkUser },
    );

    await addExistingUserToCase({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
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
      { authorizedUser: mockDocketClerkUser },
    );

    await addExistingUserToCase({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
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
    getUserById.mockResolvedValue({
      pendingEmail: 'testing@example.com',
      userId: mockUserId,
    } as DbUser);
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactId: mockContactId,
            email: undefined,
            hasElectronicAccess: false,
            name: 'Bob Ross',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    await addExistingUserToCase({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: mockContactId,
      email: mockUpdatedEmail,
      name: 'Bob Ross',
    });

    expect(getContactPrimary(caseEntity)).toMatchObject({
      contactId: mockUserId, // contactId was updated to new userId
      email: undefined,
      hasElectronicAccess: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });
  });
});
