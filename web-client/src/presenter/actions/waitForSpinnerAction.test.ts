/* eslint-disable custom-rules-plugin/no-new-dates */
import { runAction } from '@web-client/presenter/test.cerebral';
import { waitForSpinnerAction } from './waitForSpinnerAction';

describe('waitForSpinnerAction', () => {
  it('waits for spinner', async () => {
    // O.K. to use Date constructor for calculating time duration
    const startTime = new Date().getTime();
    await runAction(waitForSpinnerAction);
    const endTime = new Date().getTime();

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });
});
