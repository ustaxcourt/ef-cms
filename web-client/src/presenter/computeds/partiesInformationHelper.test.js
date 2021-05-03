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
      { ...mockPetitioner, representingPractitioners: mockPractitioner },
    ]);
  });
});
