import {
  CONTACT_TYPES,
  OTHER_FILER_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { partiesInformationHelper as partiesInformationHelperComputed } from './partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('partiesInformationHelper', () => {
  const partiesInformationHelper = withAppContextDecorator(
    partiesInformationHelperComputed,
    applicationContext,
  );

  it('should return formatted petitioners with representing practitioners', () => {
    const mockId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockPetitioner = {
      contactId: mockId,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: [mockId],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
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
        representingPractitioners: [mockPractitioner],
      },
    ]);
    expect(result.formattedParticipants).toEqual([]);
  });

  it('should return formatted participants with representing practitioners and formattedTitle', () => {
    const mockId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockIntervenor = {
      contactId: mockId,
      contactType: CONTACT_TYPES.otherFiler,
      otherFilerType: UNIQUE_OTHER_FILER_TYPE,
    };
    const mockParticipant = {
      contactId: mockId,
      contactType: CONTACT_TYPES.otherFiler,
      otherFilerType: OTHER_FILER_TYPES[1],
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: [mockId],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
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

  it('should set hasCounsel to false for a petitioner that is not represented', () => {
    const mockPetitionerId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockPetitioner = {
      contactId: mockPetitionerId,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: ['abc'],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
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
    const mockPetitionerId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockEmail = 'iamverified@example.com';
    const mockPetitioner = {
      contactId: mockPetitionerId,
      email: mockEmail,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: ['abc'],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
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
    const mockPetitionerId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockPetitioner = {
      contactId: mockPetitionerId,
      email: undefined,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: ['abc'],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
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
    const mockEmail = 'test@example.com';
    const mockPetitionerId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockPetitioner = {
      contactId: mockPetitionerId,
      email: undefined,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: ['abc'],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
          petitioners: [mockPetitioner],
          privatePractitioners: [mockPractitioner],
        },
        screenMetadata: {
          pendingEmails: {
            [mockPetitionerId]: mockEmail,
          },
        },
      },
    });

    expect(result.formattedPetitioners[0].formattedPendingEmail).toBe(
      `${mockEmail} (Pending)`,
    );
  });

  it('should set formattedPendingEmail to undefined when the petitioner has no pending email', () => {
    const mockPetitionerId = '8ee0833f-6b82-4a8a-9803-8dab8bb49b63';
    const mockPetitioner = {
      contactId: mockPetitionerId,
      email: undefined,
    };
    const mockPractitioner = {
      name: 'Test Name',
      representing: ['abc'],
    };

    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
          petitioners: [mockPetitioner],
          privatePractitioners: [mockPractitioner],
        },
        screenMetadata: {
          pendingEmails: {
            [mockPetitionerId]: undefined,
          },
        },
      },
    });

    expect(
      result.formattedPetitioners[0].formattedPendingEmail,
    ).toBeUndefined();
  });

  describe('showParticipantsTab', () => {
    it('should be false when the case does not have any participants or intervenors', () => {
      const mockPetitioner = {
        contactType: CONTACT_TYPES.primary,
      };

      const result = runCompute(partiesInformationHelper, {
        state: {
          caseDetail: {
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
});
