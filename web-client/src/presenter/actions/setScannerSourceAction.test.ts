import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setScannerSourceAction } from './setScannerSourceAction';

describe('setScannerSourceAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('does nothing if scannerSourceName is not in props', async () => {
    await runAction(setScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(
      applicationContext.getScanner().setSourceByName.mock.calls.length,
    ).toEqual(0);
    expect(
      applicationContext.getUseCases().setItemInteractor.mock.calls.length,
    ).toEqual(0);
  });

  it('sets the scanner source from props in local storage', async () => {
    await runAction(setScannerSourceAction, {
      modules: {
        presenter,
      },
      props: {
        scannerSourceName: 'Mock Scanner Source',
      },
    });

    expect(
      applicationContext.getScanner().setSourceByName.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().setItemInteractor.mock.calls.length,
    ).toEqual(3);
  });
});
