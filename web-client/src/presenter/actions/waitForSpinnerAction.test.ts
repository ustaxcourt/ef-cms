import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { runAction } from '@web-client/presenter/test.cerebral';
import { waitForSpinnerAction } from './waitForSpinnerAction';

describe('waitForSpinnerAction', () => {
  it('waits for spinner', async () => {
    const startTime = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS));
    await runAction(waitForSpinnerAction, { state: {} });
    const endTime = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS));

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });
});
