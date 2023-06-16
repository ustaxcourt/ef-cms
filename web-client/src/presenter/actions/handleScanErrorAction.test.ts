import { handleScanErrorAction } from './handleScanErrorAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('handleScanErrorAction', () => {
  it('should show the EmptyHopperModal modal when no images could be acquired', async () => {
    const result = await runAction(handleScanErrorAction, {
      modules: {
        presenter,
      },
      props: {
        error: {
          message: 'no images in buffer',
        },
      },
      state: {
        scanner: {
          isScanning: true,
        },
        showModal: '',
      },
    });

    expect(result.state.modal.showModal).toEqual('EmptyHopperModal');
    expect(result.state.scanner.isScanning).toBeFalsy();
  });

  it('should show the ScanErrorModal modal for all other errors', async () => {
    const result = await runAction(handleScanErrorAction, {
      modules: {
        presenter,
      },
      props: {
        error: {
          message: 'Bios: Keyboard not found. Press F1 to continue.',
        },
      },
      state: {
        scanner: {
          isScanning: true,
        },
        showModal: '',
      },
    });

    expect(result.state.modal.showModal).toEqual('ScanErrorModal');
    expect(result.state.scanner.isScanning).toBeFalsy();
  });
});
