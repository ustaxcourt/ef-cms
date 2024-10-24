import { DateTime } from 'luxon';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { publicTrialSessionsHelper } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('publicTrialSessionsHelper', () => {
  const TEST_TIME = DateTime.fromObject({
    day: 22,
    hour: 0,
    minute: 0,
    month: 10,
    second: 0,
    year: 2024,
  });

  it('should generate the correct "fetchedDateString" string', () => {
    const { fetchedDateString } = runCompute(publicTrialSessionsHelper, {
      state: {
        FetchedTrialSessions: TEST_TIME,
        publicTrialSessionData: {},
      },
    });

    expect(fetchedDateString).toBe('10/22/24 12:00 AM Eastern');
  });

  it('should return the "sessiontTypeOptions" value correctly', () => {
    const { sessionTypeOptions } = runCompute(publicTrialSessionsHelper, {
      state: {
        FetchedTrialSessions: TEST_TIME,
        publicTrialSessionData: {},
      },
    });

    expect(sessionTypeOptions).toEqual([
      {
        label: 'Regular',
        value: 'Regular',
      },
      {
        label: 'Small',
        value: 'Small',
      },
      {
        label: 'Hybrid',
        value: 'Hybrid',
      },
      {
        label: 'Hybrid-S',
        value: 'Hybrid-S',
      },
      {
        label: 'Special',
        value: 'Special',
      },
      {
        label: 'Motion/Hearing',
        value: 'Motion/Hearing',
      },
    ]);
  });

  it('should return the "trialCitiesByState" value correctly', () => {
    const { trialCitiesByState } = runCompute(publicTrialSessionsHelper, {
      state: {
        FetchedTrialSessions: TEST_TIME,
        publicTrialSessionData: {},
      },
    });

    expect(trialCitiesByState).toBeDefined();
  });

  it('should return the "trialSessionJudgeOptions" value correctly', () => {
    const { trialSessionJudgeOptions } = runCompute(publicTrialSessionsHelper, {
      state: {
        FetchedTrialSessions: TEST_TIME,
        judges: [
          { name: 'TEST_JUDGE_1', userId: '1' },
          { name: 'TEST_JUDGE_2', userId: '2' },
          { name: 'TEST_JUDGE_3', userId: '3' },
          { name: 'TEST_JUDGE_4', userId: '4' },
        ],
        publicTrialSessionData: {},
      },
    });

    expect(trialSessionJudgeOptions).toEqual([
      {
        label: 'TEST_JUDGE_1',
        value: {
          name: 'TEST_JUDGE_1',
          userId: '1',
        },
      },
      {
        label: 'TEST_JUDGE_2',
        value: {
          name: 'TEST_JUDGE_2',
          userId: '2',
        },
      },
      {
        label: 'TEST_JUDGE_3',
        value: {
          name: 'TEST_JUDGE_3',
          userId: '3',
        },
      },
      {
        label: 'TEST_JUDGE_4',
        value: {
          name: 'TEST_JUDGE_4',
          userId: '4',
        },
      },
    ]);
  });

  describe('filtersHaveBeenModified', () => {
    it('should return "false" if there is no filters modified', () => {
      const { filtersHaveBeenModified } = runCompute(
        publicTrialSessionsHelper,
        {
          state: {
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {},
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
        proceedingType: 'In Person',
        sessionScope: 'Standalone Remote',
        sessionStatus: 'Open',
        sessionType: 'Regular',
        startDate: '2020-11-25T05:00:00.000Z',
        term: 'Fall',
        termYear: '2020',
        trialLocation: 'Birmingham, Alabama',
        ...overrides,
      };
    }

    it('should return all the trialSessions if there are no filter', () => {
      const TEST_TRIAL_SESSIONS: TrialSessionInfoDTO[] = [
        createTrialSessionObject({ proceedingType: 'Remote' }),
        createTrialSessionObject({ sessionType: 'Small' }),
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
          FetchedTrialSessions: TEST_TIME,
          publicTrialSessionData: {},
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
        createTrialSessionObject({ sessionType: 'Small' }),
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
          sessionWeekStartDate: '2020-11-23T05:00:00.000+00:00',
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
          sessionStatus: 'Open',
          sessionType: 'Regular',
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
        createTrialSessionObject({ proceedingType: 'Remote' }),
        createTrialSessionObject({ sessionType: 'Small' }),
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
          sessionWeekStartDate: '2020-11-23T05:00:00.000+00:00',
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
          proceedingType: 'In Person',
          sessionStatus: 'Open',
          sessionType: 'Regular',
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
        createTrialSessionObject({ proceedingType: 'Remote' }),
        createTrialSessionObject({ sessionType: 'Small' }),
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
          sessionWeekStartDate: '2020-11-23T05:00:00.000+00:00',
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
          proceedingType: 'In Person',
          sessionStatus: 'Open',
          sessionType: 'Regular',
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
        createTrialSessionObject({ proceedingType: 'Remote' }),
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
            FetchedTrialSessions: TEST_TIME,
            publicTrialSessionData: {
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
          sessionWeekStartDate: '2020-11-23T05:00:00.000+00:00',
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
          proceedingType: 'In Person',
          sessionStatus: 'Open',
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
