import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCachedScannerSourceAction } from './getCachedScannerSourceAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCachedScannerSourceAction', () => {
  let mockSelectSource;
  let mockSuccess;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

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
    applicationContext
      .getPersistenceGateway()
      .getItem.mockImplementation(({ key }) => {
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
    applicationContext
      .getPersistenceGateway()
      .getItem.mockImplementation(({ key }) => {
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
