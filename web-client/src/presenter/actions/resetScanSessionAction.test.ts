import { resetScanSessionAction } from './resetScanSessionAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetScanSessionAction', () => {
  it('should reset the state for the current scanning session', async () => {
    const result = await runAction(resetScanSessionAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: [{ pages: [] }],
          },
          isScanning: true,
        },
      },
    });

    expect(result.state.scanner.batches.petition).toBeUndefined();
    expect(result.state.scanner.isScanning).toBeFalsy();
  });
});
