import { DateTime } from 'luxon';
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
});
