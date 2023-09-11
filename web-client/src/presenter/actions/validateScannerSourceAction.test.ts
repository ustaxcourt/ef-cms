import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateScannerSourceAction } from './validateScannerSourceAction';

const invalidMock = jest.fn();
const validMock = jest.fn();

describe('validateScannerSourceAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      invalid: invalidMock,
      valid: validMock,
    };
    applicationContext.getScanner.mockResolvedValue({
      getSourceNameByIndex: index => `Scanner-${index}`,
    });
  });

  afterEach(() => {
    invalidMock.mockReset();
    validMock.mockReset();
  });

  it('should return the invalid path if props.scannerSourceIndex is null', async () => {
    await runAction(validateScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: null,
        scannerSourceName: 'Scanner-1',
      },
    });
    expect(invalidMock).toHaveBeenCalled();
  });

  it('should return the invalid path if props.scannerSourceName DOES NOT match an available source', async () => {
    await runAction(validateScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: 0,
        scannerSourceName: 'Scanner-1',
      },
    });
    expect(invalidMock).toHaveBeenCalled();
  });

  it('should return the valid path if props.scannerSourceName matches an available source', async () => {
    await runAction(validateScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceIndex: 1,
        scannerSourceName: 'Scanner-1',
      },
    });
    expect(validMock).toHaveBeenCalled();
  });
});
