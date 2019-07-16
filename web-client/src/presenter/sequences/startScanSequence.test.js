import { CerebralTest } from 'cerebral/test';
import { presenter } from '../presenter';

let mockItems;
const mockSources = ['Test Source 1', 'Test Source 2'];
const mockSetItem = jest.fn();
const mockSetSourceByName = jest.fn();
const mockStartScanSession = jest.fn();

presenter.providers.applicationContext = {
  getPersistenceGateway: () => ({
    getItem: ({ key }) => mockItems[key],
  }),
  getScanner: () => ({
    getSourceNameByIndex: () => 'Mock Scanner',
    getSources: () => mockSources,
    setSourceByIndex: () => null,
    setSourceByName: mockSetSourceByName,
    startScanSession: mockStartScanSession,
  }),
  getUseCases: () => ({
    removeItemInteractor: async () => null,
    setItemInteractor: mockSetItem,
  }),
};

global.alert = () => null;

const test = CerebralTest(presenter);

describe('startScanSequence', () => {
  it('gets the cached scan source name and starts the scan action', async () => {
    mockItems = {
      scannerSourceIndex: '1',
      scannerSourceName: 'Mock Scanner',
    };
    await test.runSequence('startScanSequence', {});

    expect(mockStartScanSession).toHaveBeenCalled();
    expect(test.getState('isScanning')).toBeTruthy;
  });

  it('provides a flow for setting a scan source if one is not cached', async () => {
    mockItems = {
      scannerSourceIndex: null,
      scannerSourceName: '',
    };
    await test.runSequence('startScanSequence', {});
    const scannerState = test.getState('scanner');

    expect(scannerState.sources.length).toEqual(mockSources.length);
    expect(test.getState('showModal')).toEqual('SelectScannerSourceModal');
  });
});
