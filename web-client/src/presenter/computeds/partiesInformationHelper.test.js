import {
  CONTACT_TYPES,
  OTHER_FILER_TYPES,
  ROLES,
  UNIQUE_OTHER_FILER_TYPE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { partiesInformationHelper as partiesInformationHelperComputed } from './partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('partiesInformationHelper', () => {
  const mockEmail = 'test@example.com';
  const mockUserId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
  const mockPractitionerId = '8ee0822f-6b82-4a8a-9803-8dab8bb49b63';

  let partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
    {
      ...applicationContext,
      getCurrentUser: () => ({ role: ROLES.docketClerk }),
    },
  );

  describe('formattedParticipants', () => {
    it('should set representing practitioners and formattedTitle when they exist on the participant', () => {
      const mockIntervenor = {
        contactId: mockUserId,
        contactType: CONTACT_TYPES.otherFiler,
        otherFilerType: UNIQUE_OTHER_FILER_TYPE,
      };
      const mockParticipant = {
        contactId: mockUserId,
        contactType: CONTACT_TYPES.otherFiler,
        otherFilerType: OTHER_FILER_TYPES[1],
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: [mockUserId],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockIntervenor, mockParticipant],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedParticipants).toMatchObject([
        {
          ...mockIntervenor,
          formattedTitle: UNIQUE_OTHER_FILER_TYPE,
          hasCounsel: true,
          representingPractitioners: [mockPractitioner],
        },
        {
          ...mockParticipant,
          formattedTitle: 'Participant',
          hasCounsel: true,
          representingPractitioners: [mockPractitioner],
        },
      ]);
      expect(result.formattedPetitioners).toEqual([]);
    });
  });

  describe('formattedPetitioners', () => {
    it('should set representingPractitioners and their pending emails when they exist for a petitioner', () => {
      const mockPetitioner = {
        contactId: mockUserId,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: [mockUserId],
        userId: mockPractitionerId,
      };

      const mockPendingPractitionerEmail = 'pendingPractitioner@example.com';

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockPractitionerId]: mockPendingPractitionerEmail,
            },
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPractitioner,
              formattedPendingEmail: `${mockPendingPractitionerEmail} (Pending)`,
            },
          ],
        },
      ]);
      expect(result.formattedParticipants).toEqual([]);
    });

    it('should set representingPractitioners and their emails when they exist for a petitioner', () => {
      const mockPetitioner = {
        contactId: mockUserId,
      };
      const mockPractitioner = {
        email: mockEmail,
        name: 'Test Name',
        representing: [mockUserId],
        userId: mockPractitionerId,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPractitioner,
              formattedEmail: mockEmail,
            },
          ],
        },
      ]);
    });

    it("should set representingPractitioners.formattedEmail to `No email provided` when the petitioner's counsel does not have an email", () => {
      const mockPetitioner = {
        contactId: mockUserId,
        email: mockEmail,
      };
      const mockPractitioner = {
        representing: [mockUserId],
        userId: mockPractitionerId,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: true,
          representingPractitioners: [
            {
              ...mockPractitioner,
              formattedEmail: 'No email provided',
            },
          ],
        },
      ]);
    });

    it('should set hasCounsel to false for a petitioner that is not represented', () => {
      const mockPetitioner = {
        contactId: mockUserId,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: ['abc'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners).toMatchObject([
        {
          ...mockPetitioner,
          hasCounsel: false,
          representingPractitioners: [],
        },
      ]);
    });

    it('should set formattedEmail for a petitioner that has a verified email', () => {
      const mockPetitioner = {
        contactId: mockUserId,
        email: mockEmail,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: ['abc'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBe(mockEmail);
    });

    it('should set formattedEmail to `No email provided` for a petitioner that does not have a verified email', () => {
      const mockPetitioner = {
        contactId: mockUserId,
        email: undefined,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: ['abc'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedEmail).toBe(
        'No email provided',
      );
    });

    it('should set formattedPendingEmail when the petitioner has a pending email', () => {
      const mockPetitioner = {
        contactId: mockUserId,
        email: undefined,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: ['abc'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockUserId]: mockEmail,
            },
          },
        },
      });

      expect(result.formattedPetitioners[0].formattedPendingEmail).toBe(
        `${mockEmail} (Pending)`,
      );
    });

    it('should set formattedPendingEmail to undefined when the petitioner has no pending email', () => {
      const mockPetitioner = {
        contactId: mockUserId,
        email: undefined,
      };
      const mockPractitioner = {
        name: 'Test Name',
        representing: ['abc'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [mockPractitioner],
          },
          screenMetadata: {
            pendingEmails: {
              [mockUserId]: undefined,
            },
          },
        },
      });

      expect(
        result.formattedPetitioners[0].formattedPendingEmail,
      ).toBeUndefined();
    });
  });

  describe('formattedRespondents', () => {
    it('should set formattedEmail when it exists', () => {
      const mockRespondent = {
        contactId: mockUserId,
        email: mockEmail,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [mockRespondent],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(mockEmail);
    });

    it('should set canEditRespondent to true for internal users', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({ role: ROLES.docketClerk }),
        },
      );

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [
              {
                contactId: mockUserId,
                email: undefined,
              },
            ],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].canEditRespondent).toBeTruthy();
    });

    it('should set canEditRespondent to false for external users', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({ role: ROLES.petitioner }),
        },
      );

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [
              {
                contactId: mockUserId,
                email: undefined,
              },
            ],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].canEditRespondent).toBeFalsy();
    });

    it('should set formattedEmail to `No email provided` when the respondent does not have an email set', () => {
      const mockRespondent = {
        contactId: mockUserId,
        email: undefined,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [mockRespondent],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedRespondents[0].formattedEmail).toBe(
        'No email provided',
      );
    });

    it('should set formattedPendingEmail when the respondent has a pending email', () => {
      const mockRespondent = {
        email: undefined,
        userId: mockUserId,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [mockRespondent],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {
              [mockUserId]: mockEmail,
            },
          },
        },
      });

      expect(result.formattedRespondents[0].formattedPendingEmail).toBe(
        `${mockEmail} (Pending)`,
      );
    });

    it('should set formattedPendingEmail to undefined when the respondent has no pending email', () => {
      const mockRespondent = {
        contactId: mockUserId,
        email: undefined,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [mockRespondent],
            petitioners: [],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {
              [mockUserId]: undefined,
            },
          },
        },
      });

      expect(
        result.formattedRespondents[0].formattedPendingEmail,
      ).toBeUndefined();
    });
  });

  describe('showParticipantsTab', () => {
    it('should be false when the case does not have any participants or intervenors', () => {
      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.showParticipantsTab).toEqual(false);
    });

    it('should be true when the case has at least one participant', () => {
      const mockPetitioner = {
        contactType: CONTACT_TYPES.otherFiler,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.showParticipantsTab).toEqual(true);
    });
  });

  describe('canEditPetitioner', () => {
    it('canEditPetitioner = true, if the user is an internal user', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({ role: ROLES.docketClerk }),
        },
      );

      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(true);
    });

    it('canEditPetitioner = true, if the user is the corresponding petitioner', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({
            role: ROLES.petitioner,
            userId: 'petitioner-123',
          }),
        },
      );

      const mockPetitioner = {
        contactId: 'petitioner-123',
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(true);
    });

    it('canEditPetitioner = true for an represented petitioner for a privatePractitioner', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({
            role: ROLES.privatePractitioner,
            userId: 'privatePractitioner-123',
          }),
        },
      );

      const mockPetitioner = {
        contactId: 'petitioner-123',
        contactType: CONTACT_TYPES.primary,
      };

      const mockPrivatePractitioner = {
        contactId: 'privatePractitioner-123',
        name: 'Guy Fieri',
        representing: ['petitioner-321'],
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [
              mockPetitioner,
              { ...mockPetitioner, contactId: 'petitioner-321' },
            ],
            privatePractitioners: [mockPrivatePractitioner],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditPetitioner).toBe(false);
      expect(result.formattedPetitioners[1].canEditPetitioner).toBe(true);
    });
  });

  describe('canEditParticipant', () => {
    it('canEditParticipant = true, if the user is an internal user', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({ role: ROLES.docketClerk }),
        },
      );

      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditParticipant).toBe(true);
    });

    it('canEditParticipant = false, otherwise', () => {
      partiesInformationHelper = withAppContextDecorator(
        partiesInformationHelperComputed,
        {
          ...applicationContext,
          getCurrentUser: () => ({ role: ROLES.petitioner }),
        },
      );

      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
            irsPractitioners: [],
            petitioners: [mockPetitioner],
            privatePractitioners: [],
          },
          screenMetadata: {
            pendingEmails: {},
          },
        },
      });

      expect(result.formattedPetitioners[0].canEditParticipant).toBe(false);
    });
  });
});
