import { CerebralTest } from 'cerebral/test';
import { presenter } from '../presenter';

const mockSetItem = jest.fn();
const mockSetSourceByName = jest.fn();

presenter.providers.applicationContext = {
  getScanner: () => ({
    setSourceByName: mockSetSourceByName,
  }),
  getUseCases: () => ({
    setItem: mockSetItem,
  }),
};

const test = CerebralTest(presenter);

describe('setScannerSourceSequence', () => {
  it('should set the scanner source based on props and close the selector modal', async () => {
    test.setState('showModal', 'SelectScannerSourceModal');
    test.setState('scanner', {});

    await test.runSequence('setScannerSourceSequence', {
      scannerSourceName: 'Test Scanner 1',
    });

    expect(mockSetSourceByName).toHaveBeenCalled();
    expect(mockSetItem).toHaveBeenCalled();
    expect(test.getState('showModal')).toEqual('');
  });
});
