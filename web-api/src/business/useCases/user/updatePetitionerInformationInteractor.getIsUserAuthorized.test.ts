import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import {
  MOCK_PRACTITIONER,
  docketClerkUser,
} from '../../../../../shared/src/test/mockUsers';
import { getIsUserAuthorized } from './updatePetitionerInformationInteractor';

describe('updatePetitionerInformationInteractor getIsUserAuthorized', () => {
  let mockUser;
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
    mockUser = docketClerkUser;

    mockCase = {
      ...MOCK_CASE,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.generalDocket,
    };
  });

  describe('getIsUserAuthorized', () => {
    it('should return false when the user is a privatePractitioner not associated with the case', () => {
      const isUserAuthorized = getIsUserAuthorized({
        oldCase: mockCase,
        updatedPetitionerData: {},
        user: {
          ...mockUser,
          role: ROLES.privatePractitioner,
          userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
        },
      });

      expect(isUserAuthorized).toBeFalsy();
    });

    it('should return false when the user is a petitioner attempting to modify another petitioner', () => {
      const isUserAuthorized = getIsUserAuthorized({
        oldCase: mockCase,
        updatedPetitionerData: {},
        user: {
          ...mockUser,
          role: ROLES.petitioner,
          userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
        },
      });

      expect(isUserAuthorized).toBeFalsy();
    });

    it('should return true when the user is a petitioner its own contact information', () => {
      const isUserAuthorized = getIsUserAuthorized({
        oldCase: mockCase,
        updatedPetitionerData: { contactId: SECONDARY_CONTACT_ID },
        user: {
          ...mockUser,
          role: ROLES.petitioner,
          userId: SECONDARY_CONTACT_ID,
        },
      });

      expect(isUserAuthorized).toBeTruthy();
    });

    it('should return true when the user is representingCounsel', () => {
      const isUserAuthorized = getIsUserAuthorized({
        oldCase: {
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
          ...mockUser,
          role: ROLES.privatePractitioner,
          userId: SECONDARY_CONTACT_ID,
        },
      });

      expect(isUserAuthorized).toBeTruthy();
    });
  });
});
