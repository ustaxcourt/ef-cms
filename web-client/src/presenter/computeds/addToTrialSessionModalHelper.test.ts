import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from './addToTrialSessionModalHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('addToTrialSessionModalHelper', () => {
  const addToTrialSessionModalHelper = withAppContextDecorator(
    addToTrialSessionModalHelperComputed,
  );

  const { TRIAL_SESSION_SCOPE_TYPES, US_STATES } =
    applicationContext.getConstants();

  const trialSessions = [
    {
      sessionStatus: 'Open',
      sessionType: 'Small',
      startDate: '2019-05-01T21:40:46.415Z',
      trialLocation: 'Boise, Idaho',
      trialSessionId: '4',
    },
    {
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '1',
    },
    {
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2022-03-01T21:40:46.415Z',
      trialLocation: 'Standalone Remote',
      trialSessionId: '7',
    },
    {
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Hybrid',
      startDate: '2018-02-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '2',
    },
    {
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Hybrid-S',
      startDate: '2018-01-02T21:40:46.415Z',
      trialLocation: 'Spokane, Washington',
      trialSessionId: '8',
    },
    {
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Special',
      startDate: '2019-01-01T21:40:46.415Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '3',
    },
    {
      sessionStatus: 'Open',
      sessionType: 'Motion/Hearing',
      startDate: '2018-12-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '5',
    },
  ];

  it('should not return trialSessionsFormatted or trialSessionsFormattedByState if modal state does not contain trialSessions', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: {
          hearings: [],
        },
        form: {},
        modal: {},
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toBeFalsy();
  });

  it('should filter out hearings that case is already scheduled for', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: {
          hearings: [
            {
              trialSessionId: '6',
            },
          ],
          preferredTrialCity: 'Birmingham, Alabama',
        },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: [
            ...trialSessions,
            {
              trialLocation: 'Nashville, Tennessee',
              trialSessionId: '6',
            },
          ],
        },
      },
    });

    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: [
        {
          trialSessionId: '3',
        },
        {
          trialSessionId: '1',
        },
        {
          trialSessionId: '2',
        },
        {
          trialSessionId: '5',
        },
      ],
      Idaho: [
        {
          trialSessionId: '4',
        },
      ],
      Remote: [
        {
          trialSessionId: '7',
        },
      ],
    });

    expect(result.trialSessionStatesSorted.includes('Tennessee')).toBeFalsy();
  });

  it('should filter out trial sessions that are closed', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: [
            ...trialSessions,
            {
              trialLocation: 'Nashville, Tennessee',
              trialSessionId: '6',
            },
          ],
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: [
        {
          trialSessionId: '3',
        },
        {
          trialSessionId: '1',
        },
        {
          trialSessionId: '2',
        },
        {
          trialSessionId: '5',
        },
      ],
      Idaho: [
        {
          trialSessionId: '4',
        },
      ],
      Remote: [
        {
          trialSessionId: '7',
        },
      ],
    });
  });

  it('should filter trialSessions by preferredTrialCity if state.modal.showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: false,
          trialSessions,
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toBeFalsy();
    expect(result.trialSessionsFormatted.length).toEqual(2);
    expect(result.trialSessionsFormatted).toMatchObject([
      { trialLocation: 'Birmingham, Alabama' },
      { trialLocation: 'Birmingham, Alabama' },
    ]);
  });

  it('should format optionText for each trial session and group by state (or "Remote"), then sort by location and then by date when showAllLocations is true', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions,
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: [
        {
          optionText: 'Birmingham, Alabama 01/01/19 (SP)',
          trialLocationState: US_STATES.AL,
          trialSessionId: '3',
        },
        {
          optionText: 'Birmingham, Alabama 03/01/19 (R)',
          trialSessionId: '1',
        },
        {
          optionText: 'Mobile, Alabama 02/01/18 (H)',
          trialSessionId: '2',
        },
        {
          optionText: 'Mobile, Alabama 12/01/18 (M/H)',
          trialSessionId: '5',
        },
      ],
      Idaho: [
        {
          optionText: 'Boise, Idaho 05/01/19 (S)',
          trialSessionId: '4',
        },
      ],
      Remote: [
        {
          optionText: 'Standalone Remote 03/01/22 (R)',
          trialSessionId: '7',
        },
      ],
      Washington: [
        {
          optionText: 'Spokane, Washington 01/02/18 (HS)',
          trialSessionId: '8',
        },
      ],
    });
  });

  it('should sort states alphabetically, "Remote" at the top', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Juneau, Alaska' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions,
        },
      },
    });

    expect(result.trialSessionStatesSorted).toEqual([
      'Remote',
      US_STATES.AL,
      US_STATES.ID,
      US_STATES.WA,
    ]);
  });

  it('should format optionText for each trial session and sort by date when showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: false,
          trialSessions,
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toBeFalsy();
    expect(result.trialSessionsFormatted.length).toEqual(2);
    expect(result.trialSessionsFormatted).toMatchObject([
      {
        optionText: 'Birmingham, Alabama 01/01/19 (SP)',
        trialSessionId: '3',
      },
      {
        optionText: 'Birmingham, Alabama 03/01/19 (R)',
        trialSessionId: '1',
      },
    ]);
  });

  it('should show a "session not set" alert if the selected trial session has yet to be calendared', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { hearings: [], preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: false,
          trialSessionId: '6',
          trialSessions: [
            ...trialSessions,
            {
              isCalendared: false,
              sessionType: 'Small',
              startDate: '2019-05-01T21:40:46.415Z',
              trialLocation: 'Boise, Idaho',
              trialSessionId: '6',
            },
          ],
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeTruthy();
  });
});
