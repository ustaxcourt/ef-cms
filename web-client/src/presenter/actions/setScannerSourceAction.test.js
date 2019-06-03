import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setScannerSourceAction } from './setScannerSourceAction';

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

describe('setScannerSourceAction', () => {
  it('sets the scanner source from props in local storage', async () => {
    await runAction(setScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceName: 'Mock Scanner Source',
      },
    });
    expect(mockSetSourceByName).toHaveBeenCalled();
    expect(mockSetItem).toHaveBeenCalled();
  });
});
