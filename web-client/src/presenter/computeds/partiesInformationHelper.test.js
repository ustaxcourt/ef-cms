import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
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
      },
    });

    expect(result.formattedPetitioners).toMatchObject([
      {
        ...mockPetitioner,
        hasCounsel: true,
        representingPractitioners: [mockPractitioner],
      },
    ]);
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
        },
      });

      expect(result.showParticipantsTab).toBeFalsy();
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
        },
      });

      expect(result.showParticipantsTab).toBeTruthy();
    });
  });
});
