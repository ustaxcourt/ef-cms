import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { setForHearingModalHelper as setForHearingModalHelperComputed } from './setForHearingModalHelper';
import { withAppContextDecorator } from '../../withAppContext';

const setForHearingModalHelper = withAppContextDecorator(
  setForHearingModalHelperComputed,
);

describe('set for hearing modal helper', () => {
  const { US_STATES } = applicationContext.getConstants();

  const trialSessions = [
    {
      sessionStatus: 'New',
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
      sessionStatus: 'Open',
      sessionType: 'Hybrid',
      startDate: '2018-02-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '2',
    },
    {
      sessionStatus: 'New',
      sessionType: 'Special',
      startDate: '2019-01-01T21:40:46.415Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '3',
    },
    {
      sessionStatus: 'New',
      sessionType: 'Motion/Hearing',
      startDate: '2018-12-01T21:40:46.415Z',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '5',
    },
  ];

  it('should filter out trial sessions that are either closed or new', () => {
    const result = runCompute(setForHearingModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: [
            ...trialSessions,
            {
              sessionStatus: 'New',
              trialLocation: 'Nashville, Tennessee',
              trialSessionId: '6',
            },
            {
              isCalendared: true,
              sessionStatus: 'Open',
              startDate: '2021-12-01T21:40:46.415Z',
              trialLocation: 'Little Rock, Arkansas',
              trialSessionId: '1337',
            },
          ],
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Arkansas: expect.arrayContaining([
        expect.objectContaining({ trialSessionId: '1337' }),
      ]),
    });
  });

  it('should exclude the trial session that is already assigned to the case', () => {
    const result = runCompute(setForHearingModalHelper, {
      state: {
        caseDetail: {
          preferredTrialCity: 'Birmingham, Alabama',
          trialSessionId: '1',
        },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: trialSessions.map(trialSession => ({
            ...trialSession,
            isCalendared: true,
            sessionStatus: 'Open',
          })),
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: expect.arrayContaining([
        expect.objectContaining({
          optionText: 'Birmingham, Alabama 01/01/19 (SP)',
          trialLocationState: US_STATES.AL,
          trialSessionId: '3',
        }),
        expect.objectContaining({
          sessionType: 'Hybrid',
          startDate: '2018-02-01T21:40:46.415Z',
          trialLocation: 'Mobile, Alabama',
          trialSessionId: '2',
        }),
        expect.objectContaining({
          optionText: 'Mobile, Alabama 12/01/18 (M/H)',
          trialSessionId: '5',
        }),
      ]),
      Idaho: [
        expect.objectContaining({
          optionText: 'Boise, Idaho 05/01/19 (S)',
          trialSessionId: '4',
        }),
      ],
    });
    expect(result.trialSessionStatesSorted).toEqual([
      US_STATES.AL,
      US_STATES.ID,
    ]);
  });

  it('should exclude the hearings that are already assigned to the case', () => {
    const result = runCompute(setForHearingModalHelper, {
      state: {
        caseDetail: {
          hearings: [{ trialSessionId: '2' }],
          preferredTrialCity: 'Birmingham, Alabama',
        },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: trialSessions.map(trialSession => ({
            ...trialSession,
            isCalendared: true,
            sessionStatus: 'Open',
          })),
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: expect.arrayContaining([
        expect.objectContaining({
          optionText: 'Birmingham, Alabama 01/01/19 (SP)',
          trialLocationState: US_STATES.AL,
          trialSessionId: '3',
        }),
        expect.objectContaining({
          sessionType: 'Regular',
          startDate: '2019-03-01T21:40:46.415Z',
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '1',
        }),
        expect.objectContaining({
          optionText: 'Mobile, Alabama 12/01/18 (M/H)',
          trialSessionId: '5',
        }),
      ]),
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

  it('should exclude all trial sessions that are not open', () => {
    const result = runCompute(setForHearingModalHelper, {
      state: {
        caseDetail: {
          hearings: [{ trialSessionId: '2' }],
          preferredTrialCity: 'Birmingham, Alabama',
          trialSessionId: '1',
        },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions,
        },
      },
    });

    expect(result.showSessionNotSetAlert).toBeFalsy();
    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toEqual({});
    expect(result.trialSessionStatesSorted).toEqual([]);
  });
});
