import { getCachedScannerSourceAction } from './getCachedScannerSourceAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockSelectSource = jest.fn();
const mockSuccess = jest.fn();

// Mocking File
global.File = class {
  constructor() {
    this.foo = 'bar';
  }
};

let mockItems;

presenter.providers.applicationContext = {
  getPersistenceGateway: () => ({
    getItem: ({ key }) => mockItems[key],
  }),
};

presenter.providers.path = {
  selectSource: mockSelectSource,
  success: mockSuccess,
};

describe('getCachedScannerSourceAction', () => {
  it('gets the cached scanner source from local storage and returns it via path.success', async () => {
    mockItems = {
      scannerSourceName: 'Mock Scanner',
    };
    await runAction(getCachedScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });
    expect(mockSuccess).toHaveBeenCalled();
  });

  it('fails to find a cached scanner source and calls path.selectSource', async () => {
    mockItems = {
      scannerSourceName: '',
    };
    await runAction(getCachedScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });
    expect(mockSelectSource).toHaveBeenCalled();
  });
});
