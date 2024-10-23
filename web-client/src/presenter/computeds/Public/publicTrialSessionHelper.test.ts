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
      },
    });

    expect(fetchedDateString).toBe('10/22/24 12:00 AM Eastern');
  });

  it('should return the "sessiontTypeOptions" value correctly', () => {
    const { sessionTypeOptions } = runCompute(publicTrialSessionsHelper, {
      state: {
        FetchedTrialSessions: TEST_TIME,
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
});
