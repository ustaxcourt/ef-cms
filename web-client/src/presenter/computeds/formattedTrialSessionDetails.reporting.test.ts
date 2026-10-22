import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { formattedTrialSessionDetails } from './formattedTrialSessionDetails';
import { getFormattedTrialSessionDetails } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('Reporting session editing', () => {
  it('allows docket clerks to edit future Reporting sessions', () => {
    applicationContext
      .getUtilities()
      .getFormattedTrialSessionDetails.mockImplementation(
        getFormattedTrialSessionDetails,
      );
    const result = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails, applicationContext),
      {
        state: {
          user: { role: 'docketclerk' },
          trialSession: {
            ...MOCK_TRIAL_REGULAR,
            startDate: '2090-11-25T15:00:00.000Z',
            estimatedEndDate: '2090-11-25T15:00:00.000Z',
            proceedingType: 'Reporting',
            startTime: undefined,
            eligibleCases: [],
            calendaredCases: [],
          },
        },
      },
    );
    expect(result.editPermissions).toBe('all');
  });
});
