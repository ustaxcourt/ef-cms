import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateScannerSourceAction } from './validateScannerSourceAction';

const invalidMock = jest.fn();
const validMock = jest.fn();

presenter.providers.path = {
  invalid: invalidMock,
  valid: validMock,
};

presenter.providers.applicationContext = {
  getScanner: async () => ({
    getSourceNameByIndex: index => `Scanner-${index}`,
  }),
};

describe('validateScannerSourceAction', () => {
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
