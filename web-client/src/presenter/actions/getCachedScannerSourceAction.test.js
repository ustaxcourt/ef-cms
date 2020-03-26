import { getCachedScannerSourceAction } from './getCachedScannerSourceAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getCachedScannerSourceAction', () => {
  let mockSelectSource;
  let mockSuccess;
  let getItem;

  beforeEach(() => {
    const applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;
    getItem = applicationContext.getPersistenceGateway().getItem;

    global.File = class {
      constructor() {
        this.foo = 'bar';
      }
    };

    mockSelectSource = jest.fn();
    mockSuccess = jest.fn();

    presenter.providers.path = {
      sourceInCache: mockSuccess,
      sourceNotInCache: mockSelectSource,
    };
  });

  it('gets the cached scanner source from local storage and returns it via path.success', async () => {
    getItem.mockImplementation(({ key }) => {
      const mockItems = {
        scannerSourceName: 'Mock Scanner',
      };
      return mockItems[key];
    });
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
    getItem.mockImplementation(({ key }) => {
      const mockItems = {
        scannerSourceName: '',
      };
      return mockItems[key];
    });

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
