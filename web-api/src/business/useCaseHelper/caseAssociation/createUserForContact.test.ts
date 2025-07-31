jest.mock('@web-api/persistence/postgres/users/createNewPetitionerUser');
import {
  ACCOUNT_STATUS,
  CONTACT_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  Case,
  getContactPrimary,
} from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { createUserForContact } from './createUserForContact';
import {
  mockAdmissionsClerkUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { createNewPetitionerUser as createNewPetitionerUserMock } from '@web-api/persistence/postgres/users/createNewPetitionerUser';

describe('createUserForContact', () => {
  const USER_ID = '674fdded-1d17-4081-b9fa-950abc677cee';
  const createNewPetitionerUser = jest.mocked(createNewPetitionerUserMock);

  it('should throw an unauthorized error for non admissionsclerk users', async () => {
    await expect(
      createUserForContact({
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
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(createNewPetitionerUser.mock.calls[0][0].user).toMatchObject({
      contact: {},
      name: 'Bob Ross',
      pendingEmail: UPDATED_EMAIL,
      role: ROLES.petitioner,
      userId: USER_ID,
      accountStatus: ACCOUNT_STATUS.active
    });
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
      authorizedUser: mockAdmissionsClerkUser,
      caseEntity,
      contactId: USER_ID,
      email: UPDATED_EMAIL,
      name: 'Bob Ross',
    });

    expect(updatedCase).toMatchObject(caseEntity);
  });
});
