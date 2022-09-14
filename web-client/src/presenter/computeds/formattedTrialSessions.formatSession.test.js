/* eslint-disable max-lines */
import {
  FORMATS,
  formatNow,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../applicationContext';
import { formatSession } from './formattedTrialSessions';

const { TRIAL_SESSION_PROCEEDING_TYPES, TRIAL_SESSION_TYPES } =
  applicationContext.getConstants();

let nextYear;

let TRIAL_SESSIONS_LIST = [];

describe('formattedTrialSessions formatSession', () => {
  beforeAll(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
  });

  beforeEach(() => {
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
      },
      {
        caseOrder: [],
        estimatedEndDate: '2045-02-17T15:00:00.000Z',
        judge: { name: '6', userId: '6' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: false,
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
    ];
  });

  it('formats trial sessions correctly selecting startOfWeek and formatting start date, startOfWeekSortable, and formattedNoticeIssued', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[0], applicationContext);
    expect(result).toMatchObject({
      formattedNoticeIssuedDate: '07/25/2019',
      formattedStartDate: '11/27/19',
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
      startOfWeekSortable: '20191125',
    });
  });

  it('formats trial sessions correctly formatting start date with an estimatedEndDate', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[1], applicationContext);
    expect(result).toMatchObject({
      formattedEstimatedEndDate: '02/17/45',
      formattedStartDate: '02/17/23',
      judge: { name: '6', userId: '6' },
      startDate: '2023-02-17T15:00:00.000Z',
      startOfWeek: 'February 13, 2023',
    });
  });
});
