import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { primeScannerSourceAction } from './primeScannerSourceAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('primeScannerSourceAction', () => {
  const SCANNER = 'Transporter Room 3';
  const SCAN_MODE = 'transport';
  const INDEX = 3;
  const { SCAN_MODES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(MOCK_CASE);
  });

  it('should return state.modal.scanner as scannerSourceName', async () => {
    const result = await runAction(primeScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { scanner: SCANNER },
      },
    });

    expect(result.output.scannerSourceName).toEqual(SCANNER);
  });

  it('should return state.modal.index as scannerSourceIndex', async () => {
    const result = await runAction(primeScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { index: INDEX },
      },
    });

    expect(result.output.scannerSourceIndex).toEqual(INDEX);
  });

  it('should return state.modal.scanMode as scanMode', async () => {
    const result = await runAction(primeScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { scanMode: SCAN_MODE },
      },
    });

    expect(result.output.scanMode).toEqual(SCAN_MODE);
  });

  it('should return state.modal.scanMode as a default if state.modal.scanMode is not set', async () => {
    const result = await runAction(primeScannerSourceAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {},
      },
    });

    expect(result.output.scanMode).toEqual(SCAN_MODES.FEEDER);
  });
});
