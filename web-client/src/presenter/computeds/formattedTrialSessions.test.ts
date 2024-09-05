import {
  FORMATS,
  formatNow,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatTrialSessionDisplayOptions } from './addToTrialSessionModalHelper';
import { formattedTrialSessions as formattedTrialSessionsComputed } from './formattedTrialSessions';
import { judgeUser } from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
jest.mock('./addToTrialSessionModalHelper.ts');

const {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  USER_ROLES: ROLES,
} = applicationContext.getConstants();

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
  {
    ...applicationContext,
  },
);

let nextYear;

const baseState = {
  constants: { USER_ROLES: ROLES },
  judgeUser,
};

let TRIAL_SESSIONS_LIST: any[] = [];

describe('formattedTrialSessions', () => {
  beforeAll(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
  });

  beforeEach(() => {
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: judgeUser.name, userId: judgeUser.userId },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.regular,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Hartford, Connecticut',
        trialSessionId: '1',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '2', userId: '2' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.small,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
        trialSessionId: '2',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '3',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '55', userId: '55' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        startDate: '2019-10-27T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '5',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '88', userId: '88' },
        noticeIssuedDate: '2020-07-26T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        startDate: '2020-11-26T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '8',
      },
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: '4', userId: '4' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.hybrid,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Summer',
        trialLocation: 'Memphis, TN',
        trialSessionId: '4',
      },
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: '5', userId: '5' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.hybrid,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: false,
        term: 'Spring',
        termYear: '2019',
        trialLocation: 'Anchorage, AK',
      },
      {
        caseOrder: [],
        estimatedEndDate: '2045-02-17T15:00:00.000Z',
        isCalendared: true,
        judge: { name: '6', userId: '6' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.regular,
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: false,
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
    ];

    (formatTrialSessionDisplayOptions as jest.Mock).mockImplementation(
      session => session,
    );
  });

  it('shows swing session option only if matching term and term year is found', () => {
    let form = {
      term: 'Winter',
      termYear: '2019',
    };
    let result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();

    form.term = 'Spring';
    result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(1);
    expect(result.showSwingSessionOption).toBeTruthy();

    form.termYear = '2011'; // similar term but not a matching year
    result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();
  });

  it('returns sessionsByTerm with only sessions in that term sorted chronologically if form.term is set', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });

    expect(result.sessionsByTerm).toEqual([
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '07/25/2019',
        formattedStartDate: '10/27/19',
        isCalendared: false,
        judge: { name: '55', userId: '55' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        showAlertForNOTTReminder: undefined,
        startDate: '2019-10-27T15:00:00.000Z',
        startOfWeek: 'October 21, 2019',
        startOfWeekSortable: '20191021',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '5',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '07/25/2019',
        formattedStartDate: '11/27/19',
        isCalendared: false,
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        showAlertForNOTTReminder: undefined,
        startDate: '2019-11-27T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '3',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '07/26/2020',
        formattedStartDate: '11/26/20',
        isCalendared: false,
        judge: { name: '88', userId: '88' },
        noticeIssuedDate: '2020-07-26T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        showAlertForNOTTReminder: undefined,
        startDate: '2020-11-26T15:00:00.000Z',
        startOfWeek: 'November 23, 2020',
        startOfWeekSortable: '20201123',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '8',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '',
        formattedStartDate: '11/25/19',
        isCalendared: false,
        judge: { name: '2', userId: '2' },
        proceedingType: 'Remote',
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.small,
        showAlertForNOTTReminder: undefined,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
        trialSessionId: '2',
        userIsAssignedToSession: false,
      },
    ]);
  });

  it('makes a call to format display text on sessionsByTerm', () => {
    runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });

    expect(formatTrialSessionDisplayOptions).toHaveBeenCalled();
  });

  it('removes the current trial session from the sessionsByTerm when state.trialSession.trialSessionId is defined', () => {
    const { sessionsByTerm } = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSession: { trialSessionId: TRIAL_SESSIONS_LIST[1].trialSessionId },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: judgeUser,
      },
    });

    expect(
      sessionsByTerm.find(
        session =>
          session.trialSessionId === TRIAL_SESSIONS_LIST[1].trialSessionId,
      ),
    ).toBeUndefined();
  });
});
