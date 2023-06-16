import { runAction } from '@web-client/presenter/test.cerebral';
import { waitForSpinnerAction } from './waitForSpinnerAction';

describe('waitForSpinnerAction', () => {
  it('waits for spinner', async () => {
    // O.K. to use Date constructor for calculating time duration
    /* eslint-disable @miovision/disallow-date/no-new-date */
    const startTime = new Date().getTime();
    await runAction(waitForSpinnerAction);
    const endTime = new Date().getTime();

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });
});
