import {
  PUBLIC_TRIAL_SESSIONS_DATA_KEY,
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { publicTrialSessionsHelper } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('publicTrialSessionsHelper', () => {
  it('should return the "sessionTypeOptions" value correctly', () => {
    const { sessionTypeOptions } = runCompute(publicTrialSessionsHelper, {
      state: {
        [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {},
      },
    });

    expect(sessionTypeOptions).toEqual([
      {
        label: SESSION_TYPES.regular,
        value: SESSION_TYPES.regular,
      },
      {
        label: SESSION_TYPES.small,
        value: SESSION_TYPES.small,
      },
      {
        label: SESSION_TYPES.hybrid,
        value: SESSION_TYPES.hybrid,
      },
      {
        label: SESSION_TYPES.hybridSmall,
        value: SESSION_TYPES.hybridSmall,
      },
      {
        label: SESSION_TYPES.special,
        value: SESSION_TYPES.special,
      },
      {
        label: SESSION_TYPES.motionHearing,
        value: SESSION_TYPES.motionHearing,
      },
    ]);
  });

  it('should return the "trialCitiesByState" value correctly', () => {
    const { trialCitiesByState } = runCompute(publicTrialSessionsHelper, {
      state: {
        [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {},
      },
    });

    expect(trialCitiesByState).toBeDefined();
  });

  it('should return the "trialSessionJudgeOptions" value correctly', () => {
    const { trialSessionJudgeOptions } = runCompute(publicTrialSessionsHelper, {
      state: {
        [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {},
        judges: [
          { name: 'TEST_JUDGE_1', userId: '1' },
          { name: 'TEST_JUDGE_2', userId: '2' },
          { name: 'TEST_JUDGE_3', userId: '3' },
          { name: 'TEST_JUDGE_4', userId: '4' },
        ],
      },
    });

    expect(trialSessionJudgeOptions).toEqual([
      {
        label: 'TEST_JUDGE_1',
        value: 'TEST_JUDGE_1',
      },
      {
        label: 'TEST_JUDGE_2',
        value: 'TEST_JUDGE_2',
      },
      {
        label: 'TEST_JUDGE_3',
        value: 'TEST_JUDGE_3',
      },
      {
        label: 'TEST_JUDGE_4',
        value: 'TEST_JUDGE_4',
      },
    ]);
  });

  describe('filtersHaveBeenModified', () => {
    it('should return "false" when there are no filters modified', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {},
          },
        },
      );

      expect(filtersHaveBeenModified).toEqual(false);
    });

    it('should return "true" when the "proceedingTypes" is not default', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              proceedingType: 'SOME_OPTION',
            },
          },
        },
      );

      expect(filtersHaveBeenModified).toEqual(true);
    });

    it('should return "true" when the "judges" is not default', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              judges: {
                TEST_JUDGE: 'TEST_JUDGE',
              },
            },
          },
        },
      );

      expect(filtersHaveBeenModified).toEqual(true);
    });

    it('should return "true" when the "locations" is not default', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              locations: {
                TEST_LOCATION: 'TEST_LOCATION',
              },
            },
          },
        },
      );

      expect(filtersHaveBeenModified).toEqual(true);
    });

    it('should return "true" when the "sessionTypes" is not default', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              sessionTypes: {
                TEST_SESSION_TYPE: 'TEST_SESSION_TYPE',
              },
            },
          },
        },
      );

      expect(filtersHaveBeenModified).toEqual(true);
    });
  });

  describe('trialSessionRows', () => {
    function createTrialSessionObject(overrides: {
      [key: string]: any;
    }): TrialSessionInfoDTO {
      return {
        isCalendared: true,
        judge: {
          name: 'Ashford',
          userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
        },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        sessionStatus: SESSION_STATUS_TYPES.open,
        sessionType: SESSION_TYPES.regular,
        startDate: '2020-11-25T05:00:00.000Z',
        term: 'Fall',
        termYear: '2020',
        trialLocation: 'Birmingham, Alabama',
        ...overrides,
      };
    }

    it('should return all the trialSessions when there are no filters', () => {
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        }),
        createTrialSessionObject({ sessionType: SESSION_TYPES.small }),
        createTrialSessionObject({ trialLocation: 'Mobile, Alabama' }),
        createTrialSessionObject({
          judge: {
            name: 'Buch',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
        }),
      ];

      const { trialSessionsCount } = runCompute(publicTrialSessionsHelper, {
        state: {
          [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {},
          trialSessionsPage: {
            trialSessions: TEST_TRIAL_SESSIONS,
          },
        },
      });

      expect(trialSessionsCount).toEqual(4);
    });

    it('should return all the trialSessions that meet the proceedingType filter', () => {
      const TEST_PROCEEDING_TYPE = 'TEST_PROCEEDING_TYPE';
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({ proceedingType: TEST_PROCEEDING_TYPE }),
        createTrialSessionObject({ essionType: SESSION_TYPES.small }),
        createTrialSessionObject({ trialLocation: 'Mobile, Alabama' }),
        createTrialSessionObject({
          judge: {
            name: 'Buch',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
        }),
      ];

      const { trialSessionRows, trialSessionsCount } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              proceedingType: TEST_PROCEEDING_TYPE,
            },
            trialSessionsPage: {
              trialSessions: TEST_TRIAL_SESSIONS,
            },
          },
        },
      );

      expect(trialSessionsCount).toEqual(1);
      expect(trialSessionRows).toEqual([
        {
          formattedSessionWeekStartDate: 'November 23, 2020',
          sessionWeekStartDate: '2020-11-23T00:00:00.000-05:00',
        },
        {
          alertMessageForNOTT: '',
          formattedEstimatedEndDate: '',
          formattedNoticeIssuedDate: '',
          formattedStartDate: '11/25/20',
          judge: {
            name: 'Ashford',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
          proceedingType: 'TEST_PROCEEDING_TYPE',
          sessionStatus: SESSION_STATUS_TYPES.open,
          sessionType: SESSION_TYPES.regular,
          showAlertForNOTTReminder: false,
          startDate: '2020-11-25T05:00:00.000Z',
          swingSession: false,
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '',
          userIsAssignedToSession: false,
        },
      ]);
    });

    it('should return all the trialSessions that meet the judge filter', () => {
      const TEST_JUDGE_NAME = 'TEST_JUDGE_NAME';
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        }),
        createTrialSessionObject({ sessionType: SESSION_TYPES.small }),
        createTrialSessionObject({ trialLocation: 'Mobile, Alabama' }),
        createTrialSessionObject({
          judge: {
            name: TEST_JUDGE_NAME,
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
        }),
      ];

      const { trialSessionRows, trialSessionsCount } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              judges: {
                [TEST_JUDGE_NAME]: TEST_JUDGE_NAME,
              },
            },
            trialSessionsPage: {
              trialSessions: TEST_TRIAL_SESSIONS,
            },
          },
        },
      );

      expect(trialSessionsCount).toEqual(1);
      expect(trialSessionRows).toEqual([
        {
          formattedSessionWeekStartDate: 'November 23, 2020',
          sessionWeekStartDate: '2020-11-23T00:00:00.000-05:00',
        },
        {
          alertMessageForNOTT: '',
          formattedEstimatedEndDate: '',
          formattedNoticeIssuedDate: '',
          formattedStartDate: '11/25/20',
          judge: {
            name: TEST_JUDGE_NAME,
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          sessionStatus: SESSION_STATUS_TYPES.open,
          sessionType: SESSION_TYPES.regular,
          showAlertForNOTTReminder: false,
          startDate: '2020-11-25T05:00:00.000Z',
          swingSession: false,
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '',
          userIsAssignedToSession: false,
        },
      ]);
    });

    it('should return all the trialSessions that meet the location filter', () => {
      const TEST_LOCATION = 'TEST_LOCATION';
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        }),
        createTrialSessionObject({ sessionType: SESSION_TYPES.small }),
        createTrialSessionObject({ trialLocation: TEST_LOCATION }),
        createTrialSessionObject({
          judge: {
            name: 'Buch',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
        }),
      ];

      const { trialSessionRows, trialSessionsCount } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              locations: {
                [TEST_LOCATION]: TEST_LOCATION,
              },
            },
            trialSessionsPage: {
              trialSessions: TEST_TRIAL_SESSIONS,
            },
          },
        },
      );

      expect(trialSessionsCount).toEqual(1);
      expect(trialSessionRows).toEqual([
        {
          formattedSessionWeekStartDate: 'November 23, 2020',
          sessionWeekStartDate: '2020-11-23T00:00:00.000-05:00',
        },
        {
          alertMessageForNOTT: '',
          formattedEstimatedEndDate: '',
          formattedNoticeIssuedDate: '',
          formattedStartDate: '11/25/20',
          judge: {
            name: 'Ashford',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          sessionStatus: SESSION_STATUS_TYPES.open,
          sessionType: SESSION_TYPES.regular,
          showAlertForNOTTReminder: false,
          startDate: '2020-11-25T05:00:00.000Z',
          swingSession: false,
          trialLocation: TEST_LOCATION,
          trialSessionId: '',
          userIsAssignedToSession: false,
        },
      ]);
    });

    it('should return all the trialSessions that meet the sessionType filter', () => {
      const TEST_SESSION_TYPE = 'TEST_SESSION_TYPE';
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        }),
        createTrialSessionObject({ sessionType: TEST_SESSION_TYPE }),
        createTrialSessionObject({ trialLocation: 'Mobile, Alabama' }),
        createTrialSessionObject({
          judge: {
            name: 'Buch',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
        }),
      ];

      const { trialSessionRows, trialSessionsCount } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            [PUBLIC_TRIAL_SESSIONS_DATA_KEY]: {
              sessionTypes: {
                [TEST_SESSION_TYPE]: TEST_SESSION_TYPE,
              },
            },
            trialSessionsPage: {
              trialSessions: TEST_TRIAL_SESSIONS,
            },
          },
        },
      );

      expect(trialSessionsCount).toEqual(1);
      expect(trialSessionRows).toEqual([
        {
          formattedSessionWeekStartDate: 'November 23, 2020',
          sessionWeekStartDate: '2020-11-23T00:00:00.000-05:00',
        },
        {
          alertMessageForNOTT: '',
          formattedEstimatedEndDate: '',
          formattedNoticeIssuedDate: '',
          formattedStartDate: '11/25/20',
          judge: {
            name: 'Ashford',
            userId: 'dabbad01-18d0-43ec-bafb-654e83405416',
          },
          proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          sessionStatus: SESSION_STATUS_TYPES.open,
          sessionType: TEST_SESSION_TYPE,
          showAlertForNOTTReminder: false,
          startDate: '2020-11-25T05:00:00.000Z',
          swingSession: false,
          trialLocation: 'Birmingham, Alabama',
          trialSessionId: '',
          userIsAssignedToSession: false,
        },
      ]);
    });
  });
});
