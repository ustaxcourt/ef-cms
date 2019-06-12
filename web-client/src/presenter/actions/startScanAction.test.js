import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startScanAction } from './startScanAction';

const mockStartScanSession = jest.fn();

presenter.providers.applicationContext = {
  getScanner: () => ({
    getSourceNameByIndex: () => 'scanner',
    setSourceByIndex: () => null,
    startScanSession: mockStartScanSession,
  }),
  getUseCases: () => ({
    removeItem: async () => null,
  }),
};
global.alert = () => null;

describe('startScanAction', () => {
  it('tells the TWAIN library to begin image aquisition', async () => {
    const result = await runAction(startScanAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: 0,
        scannerSourceName: 'scanner',
      },
      state: {
        isScanning: false,
      },
    });

    expect(result.state.isScanning).toBeTruthy();
    expect(mockStartScanSession).toHaveBeenCalled();
  });
});
