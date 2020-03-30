import { runAction } from 'cerebral/test';
import { waitForSpinnerAction } from './waitForSpinnerAction';

describe('waitForSpinnerAction', () => {
  it('waits for spinner', async () => {
    const startTime = new Date().getTime();
    await runAction(waitForSpinnerAction);
    const endTime = new Date().getTime();

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });
});
