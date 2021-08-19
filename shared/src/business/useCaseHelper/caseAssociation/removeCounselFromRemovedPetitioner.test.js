const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  MOCK_PRACTITIONER,
  petitionsClerkUser,
} = require('../../../test/mockUsers');
const {
  removeCounselFromRemovedPetitioner,
} = require('./removeCounselFromRemovedPetitioner');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('removeCounselFromRemovedPetitioner', () => {
  const mockContactPrimaryId = MOCK_CASE.petitioners[0].contactId;
  const mockContactSecondaryId = 'bff888e0-6070-40ac-a7d0-6b4d88ef4b01';
  const mockSecondPractitionerUserId = '5dde0389-6e09-4e2f-a7f4-34e4f2a534a8';
  const mockThirdPractitionerUserId = '0bd63272-781f-4cbd-8b7d-7cb649ca255d';

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
  });

  it('throws an unauthorized error if user does not have correct permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      removeCounselFromRemovedPetitioner({
        applicationContext,
        caseEntity: new Case(MOCK_CASE, { applicationContext }),
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
      { applicationContext },
    );

    const updatedCase = await removeCounselFromRemovedPetitioner({
      applicationContext,
      caseEntity,
      petitionerContactId: mockContactSecondaryId,
    });

    expect(updatedCase.privatePractitioners[0].representing).toEqual([
      mockContactPrimaryId,
    ]);
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).not.toHaveBeenCalled();
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
            representing: [mockContactPrimaryId],
            userId: mockThirdPractitionerUserId,
          },
        ],
      },
      { applicationContext },
    );

    const updatedCase = await removeCounselFromRemovedPetitioner({
      applicationContext,
      caseEntity,
      petitionerContactId: mockContactSecondaryId,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase.mock
        .calls[0][0].userId,
    ).toEqual(mockSecondPractitionerUserId);
    expect(updatedCase.privatePractitioners.length).toEqual(1);
    expect(updatedCase.privatePractitioners[0].representing).toEqual([
      mockContactPrimaryId,
    ]);
  });
});
