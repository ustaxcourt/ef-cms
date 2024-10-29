import { DateTime } from 'luxon';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTimeStampAction } from '@web-client/presenter/actions/TrialSession/setTimeStampAction';

describe('setTimeStampAction', () => {
  it('should set time stamp', async () => {
    const propertyName = 'FetchedTrialSessions';
    const result = await runAction(setTimeStampAction({ propertyName }), {});

    const expectedDate = DateTime.now().setZone('America/New_York').toISODate();

    expect(result.state[propertyName].toISODate()).toEqual(expectedDate);
  });
});
