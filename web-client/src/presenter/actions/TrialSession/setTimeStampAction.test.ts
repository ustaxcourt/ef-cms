import { FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY } from '@shared/business/entities/EntityConstants';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTimeStampAction } from '@web-client/presenter/actions/TrialSession/setTimeStampAction';

describe('setTimeStampAction', () => {
  it('should set time stamp', async () => {
    const result = await runAction(
      setTimeStampAction({
        propertyName: FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY,
      }),
      {},
    );

    const fetchedTrialSessionsTimestamp =
      result.state[FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY];

    const expectedDate = formatNow(FORMATS.CURRENT_AS_OF_TIMESTAMP);

    const date = fetchedTrialSessionsTimestamp.split(':');
    const expectedDateSplit = expectedDate.split(':');
    expect(date[0]).toEqual(expectedDateSplit[0]);
    expect(date[1]).toContain('Eastern');
  });
});
