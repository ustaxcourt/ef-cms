import {
  CONTACT_TYPES,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { canUserUpdatePetitionerContact } from '@shared/business/utilities/canUserUpdatePetitionerContact';
import {
  mockPrivatePractitionerUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';

describe('updatePetitionerInformationInteractor canUserUpdatePetitionerContact', () => {
  let mockCase;
  const SECONDARY_CONTACT_ID = '56387318-0092-49a3-8cc1-921b0432bd16';

  const mockPetitioners = [
    {
      ...MOCK_CASE.petitioners[0],
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Primary Petitioner',
    },
    {
      ...MOCK_CASE.petitioners[0],
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Secondary Petitioner',
    },
  ];

  const basePractitioner = {
    ...MOCK_PRACTITIONER,
    representing: [mockPetitioners[0].contactId],
  };

  beforeEach(() => {
    mockCase = {
      ...MOCK_CASE,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.generalDocket,
    };
  });

  describe('canUserUpdatePetitionerContact', () => {
    it('should return false when the user is a privatePractitioner not associated with the case', () => {
      const isUserAuthorized = canUserUpdatePetitionerContact({
        petitionerCaseRaw: mockCase,
        updatedPetitionerData: {},
        user: {
          ...mockPrivatePractitionerUser,
          userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
        },
      });

      expect(isUserAuthorized).toBeFalsy();
    });

    it('should return false when the user is a petitioner attempting to modify another petitioner', () => {
      const isUserAuthorized = canUserUpdatePetitionerContact({
        petitionerCaseRaw: mockCase,
        updatedPetitionerData: {},
        user: {
          ...mockPetitionerUser,
          userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
        },
      });

      expect(isUserAuthorized).toBeFalsy();
    });

    it('should return false when the case is new', () => {
      mockCase.status = CASE_STATUS_TYPES.new;
      const isUserAuthorized = canUserUpdatePetitionerContact({
        petitionerCaseRaw: mockCase,
        updatedPetitionerData: { contactId: SECONDARY_CONTACT_ID },
        user: {
          ...mockPetitionerUser,
          userId: SECONDARY_CONTACT_ID,
        },
      });

      expect(isUserAuthorized).toBeFalsy();
    });

    it('should return true when the user is a petitioner its own contact information', () => {
      const isUserAuthorized = canUserUpdatePetitionerContact({
        petitionerCaseRaw: mockCase,
        updatedPetitionerData: { contactId: SECONDARY_CONTACT_ID },
        user: {
          ...mockPetitionerUser,
          userId: SECONDARY_CONTACT_ID,
        },
      });

      expect(isUserAuthorized).toBeTruthy();
    });

    it('should return true when the user is representingCounsel', () => {
      const isUserAuthorized = canUserUpdatePetitionerContact({
        petitionerCaseRaw: {
          ...mockCase,
          petitioners: [mockPetitioners[0]],
          privatePractitioners: [
            {
              ...basePractitioner,
              representing: [SECONDARY_CONTACT_ID],
              userId: SECONDARY_CONTACT_ID,
            },
          ],
        },
        updatedPetitionerData: { contactId: SECONDARY_CONTACT_ID },
        user: {
          ...mockPrivatePractitionerUser,
          userId: SECONDARY_CONTACT_ID,
        },
      });

      expect(isUserAuthorized).toBeTruthy();
    });
  });
});
