import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case, getContactPrimary } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createUserForContact } from './createUserForContact';
import {
  mockAdmissionsClerkUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { createNewPetitionerUser as createNewPetitionerUserMock } from '@web-api/persistence/postgres/users/createNewPetitionerUser';
import { associateUserWithCase as associateUserWithCaseMock } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

const createNewPetitionerUser = createNewPetitionerUserMock as jest.Mock;
const associateUserWithCase = associateUserWithCaseMock as jest.Mock;

describe('createUserForContact', () => {
  const USER_ID = '674fdded-1d17-4081-b9fa-950abc677cee';

  beforeEach(() => {
    applicationContext.getUniqueId.mockReturnValue(USER_ID);
  });

  it('should throw an unauthorized error for non admissionsclerk users', async () => {
    await expect(
      createUserForContact({
        applicationContext,
        authorizedUser: mockPetitionerUser,
        caseEntity: new Case(MOCK_CASE, {
          authorizedUser: mockDocketClerkUser,
        }),
        contactId: USER_ID,
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call createNewPetitionerUser with the new user entity', async () => {
    const UPDATED_EMAIL = 'testing@example.com';
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
      { authorizedUser: mockAdmissionsClerkUser },
    );

    await createUserForContact({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(createNewPetitionerUser.mock.calls[0][0].userToCreate).toMatchObject(
      {
        contact: {},
        name: 'Bob Ross',
        pendingEmail: UPDATED_EMAIL,
        role: ROLES.petitioner,
        userId: USER_ID,
      },
    );
  });

  it('should return the caseEntity', async () => {
    const UPDATED_EMAIL = 'testing@example.com';
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
      { authorizedUser: mockAdmissionsClerkUser },
    );

    const updatedCase = await createUserForContact({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(updatedCase).toMatchObject(caseEntity);
  });

  it('should call associateUserWithCase', async () => {
    const UPDATED_EMAIL = 'testing@example.com';
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
      { authorizedUser: mockAdmissionsClerkUser },
    );

    await createUserForContact({
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
      docketNumber: caseEntity.docketNumber,
      userId: USER_ID,
    });
  });
});
