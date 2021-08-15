import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from './addToTrialSessionModalHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

describe('add to trial session modal helper', () => {
  const { US_STATES } = applicationContext.getConstants();

  const trialSessions = [
    {
      sessionType: 'Small',
      startDate: '2019-05-01T21:40:46.415Z',
      trialLocation: 'Boise, Idaho',
      trialSessionId: '4',
    },
    {
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '1',
    },
    {
      sessionType: 'Hybrid',
      startDate: '2018-02-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '2',
    },
    {
      sessionType: 'Special',
      startDate: '2019-01-01T21:40:46.415Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '3',
    },
    {
      sessionType: 'Motion/Hearing',
      startDate: '2018-12-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '5',
    },
  ];

  it('should not return trialSessionsFormatted or trialSessionsFormattedByState if modal state does not contain trialSessions', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: {},
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
    });

    expect(result.trialSessionStatesSorted.includes('Tennessee')).toBeFalsy();
  });

  it('should filter out trial sessions that are closed', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
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
    });
  });

  it('should filter trialSessions by preferredTrialCity if state.modal.showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
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

  it('should format optionText for each trial session and group by state, then sort by location and then by date when showAllLocations is true', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
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
    });
    expect(result.trialSessionStatesSorted).toEqual([
      US_STATES.AL,
      US_STATES.ID,
    ]);
  });

  it('should format optionText for each trial session and sort by date when showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
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
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
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
