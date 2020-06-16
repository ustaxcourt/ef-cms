import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { startScanSequence } from '../sequences/startScanSequence';
describe('startScanSequence', () => {
  let test;
  let mockItems;
  const mockSources = ['Test Source 1', 'Test Source 2'];
  beforeAll(() => {
    global.alert = () => null;
    applicationContext
      .getPersistenceGateway()
      .getItem.mockImplementation(({ key }) => mockItems[key]);
    applicationContext
      .getScanner()
      .getSourceNameByIndex.mockReturnValue('Mock Scanner');
    applicationContext.getScanner().getSources.mockReturnValue(mockSources);

    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      startScanSequence,
    };
    test = CerebralTest(presenter);
  });
  it('gets the cached scan source name and starts the scan action', async () => {
    mockItems = {
      scannerSourceIndex: '1',
      scannerSourceName: 'Mock Scanner',
    };
    test.setState('scanner.batches', []);
    await test.runSequence('startScanSequence', {});

    expect(applicationContext.getScanner().startScanSession).toHaveBeenCalled();
    expect(test.getState('scanner.isScanning')).toBeTruthy();
  });

  it('provides a flow for setting a scan source if one is not cached', async () => {
    mockItems = {
      scannerSourceIndex: null,
      scannerSourceName: '',
    };
    test.setState('scanner.batches', []);
    await test.runSequence('startScanSequence', {});
    const scannerState = test.getState('scanner');

    expect(scannerState.sources.length).toEqual(mockSources.length);
    expect(test.getState('modal.showModal')).toEqual(
      'SelectScannerSourceModal',
    );
  });
});
