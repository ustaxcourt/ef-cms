import { resetScanSessionAction } from './resetScanSessionAction';
import { runAction } from 'cerebral/test';

describe('resetScanSessionAction', () => {
  it('should reset the state for the current scanning session', async () => {
    const result = await runAction(resetScanSessionAction, {
      state: {
        batches: {
          petition: [{ pages: [] }],
        },
        documentSelectedForScan: 'petition',
        isScanning: true,
        submitting: true,
      },
    });

    expect(result.state.batches.petition).toBeUndefined();
    expect(result.state.submitting).toBeFalsy();
    expect(result.state.isScanning).toBeFalsy();
  });
});
