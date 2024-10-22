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
});
