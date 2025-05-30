import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CONTACT_TYPES,
  PARTY_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { removeCounselFromRemovedPetitioner } from './removeCounselFromRemovedPetitioner';
import { disassociateUserFromCase as deleteUserFromCaseMock } from '@web-api/persistence/postgres/users/cases/disassociateUserFromCase';

const deleteUserFromCase = deleteUserFromCaseMock as jest.Mock;

describe('removeCounselFromRemovedPetitioner', () => {
  const mockContactPrimaryId = MOCK_CASE.petitioners[0].contactId;
  const mockContactSecondaryId = 'bff888e0-6070-40ac-a7d0-6b4d88ef4b01';
  const mockSecondPractitionerUserId = '5dde0389-6e09-4e2f-a7f4-34e4f2a534a8';
  const mockThirdPractitionerUserId = '0bd63272-781f-4cbd-8b7d-7cb649ca255d';

  it('throws an unauthorized error if user does not have correct permissions', async () => {
    await expect(
      removeCounselFromRemovedPetitioner({
        authorizedUser: mockPetitionerUser,
        caseEntity: new Case(MOCK_CASE, {
          authorizedUser: mockPetitionerUser,
        }),
        petitionerContactId: mockContactPrimaryId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should remove the petitioner from privatePractitioner representing array but not remove them completely from the case if another petitioner is also represented', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          MOCK_CASE.petitioners[0],
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockContactSecondaryId,
            contactType: CONTACT_TYPES.secondary,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_PRACTITIONER,
            representing: [mockContactPrimaryId, mockContactSecondaryId],
          },
        ],
      },
      { authorizedUser: mockPetitionsClerkUser },
    );

    const updatedCase = await removeCounselFromRemovedPetitioner({
      authorizedUser: mockPetitionsClerkUser,
      caseEntity,
      petitionerContactId: mockContactSecondaryId,
    });

    expect(updatedCase.privatePractitioners?.[0].representing).toEqual([
      mockContactPrimaryId,
    ]);
    expect(deleteUserFromCase).not.toHaveBeenCalled();
  });

  it('should remove the privatePractitioner from the case privatePractitioner if they are only representing the petitioner being removed', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          MOCK_CASE.petitioners[0],
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockContactSecondaryId,
            contactType: CONTACT_TYPES.secondary,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_PRACTITIONER,
            representing: [mockContactSecondaryId],
            userId: mockSecondPractitionerUserId,
          },
          {
            ...MOCK_PRACTITIONER,
            representing: [mockContactPrimaryId, mockContactSecondaryId],
            userId: mockThirdPractitionerUserId,
          },
        ],
      },
      { authorizedUser: mockPetitionsClerkUser },
    );

    const updatedCase = await removeCounselFromRemovedPetitioner({
      authorizedUser: mockPetitionsClerkUser,
      caseEntity,
      petitionerContactId: mockContactSecondaryId,
    });

    expect(deleteUserFromCase.mock.calls[0][0].userId).toEqual(
      mockSecondPractitionerUserId,
    );
    expect(updatedCase.privatePractitioners?.length).toEqual(1);
    expect(updatedCase.privatePractitioners?.[0].representing).toEqual([
      mockContactPrimaryId,
    ]);
  });

  it('should not remove the privatePracitioner if they represent both the petitioner being removed and a remaining petitioner', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          MOCK_CASE.petitioners[0],
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockContactSecondaryId,
            contactType: CONTACT_TYPES.secondary,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_PRACTITIONER,
            representing: [mockContactPrimaryId, mockContactSecondaryId],
            userId: mockSecondPractitionerUserId,
          },
          {
            ...MOCK_PRACTITIONER,
            representing: [mockContactPrimaryId, mockContactSecondaryId],
            userId: mockThirdPractitionerUserId,
          },
        ],
      },
      { authorizedUser: mockPetitionsClerkUser },
    );

    const updatedCase = await removeCounselFromRemovedPetitioner({
      authorizedUser: mockPetitionsClerkUser,
      caseEntity,
      petitionerContactId: mockContactSecondaryId,
    });

    expect(deleteUserFromCase).not.toHaveBeenCalled();
    expect(updatedCase.privatePractitioners?.length).toEqual(2);
    expect(updatedCase.privatePractitioners?.[0].representing).toEqual([
      mockContactPrimaryId,
    ]);
  });
});
