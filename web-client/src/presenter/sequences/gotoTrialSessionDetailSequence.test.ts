import { CerebralTest } from 'cerebral/test';
import { MOCK_TRIAL_INPERSON } from '../../../../shared/src/test/mockTrial';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoTrialSessionDetailSequence } from '../sequences/gotoTrialSessionDetailSequence';
import { presenter } from '../presenter-mock';

describe('gotoTrialSessionDetailSequence', () => {
  const mockTrialSessionId = '2f731ada-0276-4eca-b518-cfedc4c496d9';

  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoTrialSessionDetailSequence,
    };
    cerebralTest = CerebralTest(presenter);
    //set token to take 'isLoggedIn' path
    cerebralTest.setState('token', 'a');
  });

  it('should set up state for an uncalendared session with eligible cases and case order', async () => {
    const mockUncalendaredSession = {
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [
        {
          calendarNotes: 'manually added case',
          docketNumber: '111-21',
          isManuallyAdded: true,
        },
      ],
      isCalendared: false,
      trialSessionId: mockTrialSessionId,
    };

    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockReturnValue(
        mockUncalendaredSession,
      );

    const eligibleCases = [
      { docketNumber: '111-21' },
      { docketNumber: '222-21' },
    ];

    applicationContext
      .getUseCases()
      .getEligibleCasesForTrialSessionInteractor.mockReturnValue(eligibleCases);

    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: mockTrialSessionId,
    });

    expect(cerebralTest.getState()).toMatchObject({
      trialSession: {
        ...mockUncalendaredSession,
        eligibleCases: [
          {
            calendarNotes: 'manually added case',
            docketNumber: '111-21',
            isManuallyAdded: true,
          },
          { docketNumber: '222-21' },
        ],
        trialSessionId: mockTrialSessionId,
      },
    });
  });

  it('should set up state for a calendared session with calendared cases', async () => {
    const mockUncalendaredSession = {
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [
        {
          calendarNotes: 'manually added case',
          docketNumber: '111-21',
          isManuallyAdded: true,
        },
        {
          calendarNotes: 'not manually added',
          docketNumber: '222-21',
        },
      ],
      isCalendared: true,
      trialSessionId: mockTrialSessionId,
    };

    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockReturnValue(
        mockUncalendaredSession,
      );

    const calendaredCases = [
      { caseCaption: 'someday', docketNumber: '111-21' },
      { caseCaption: 'somehow', docketNumber: '222-21' },
    ];

    applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor.mockReturnValue(
        calendaredCases,
      );

    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: mockTrialSessionId,
    });

    expect(cerebralTest.getState()).toMatchObject({
      trialSession: {
        ...mockUncalendaredSession,
        calendaredCases: [
          {
            calendarNotes: 'manually added case',
            caseCaption: 'someday',
            docketNumber: '111-21',
            isManuallyAdded: true,
          },
          {
            calendarNotes: 'not manually added',
            caseCaption: 'somehow',
            docketNumber: '222-21',
          },
        ],
        trialSessionId: mockTrialSessionId,
      },
    });
  });
});
