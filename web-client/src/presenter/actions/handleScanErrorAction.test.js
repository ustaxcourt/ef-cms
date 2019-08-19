import { handleScanErrorAction } from './handleScanErrorAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

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
        isScanning: true,
        showModal: '',
      },
    });

    expect(result.state.showModal).toEqual('EmptyHopperModal');
    expect(result.state.isScanning).toBeFalsy();
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
        isScanning: true,
        showModal: '',
      },
    });

    expect(result.state.showModal).toEqual('ScanErrorModal');
    expect(result.state.isScanning).toBeFalsy();
  });
});
