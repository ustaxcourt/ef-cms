import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

describe('setScannerSourceSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    test = CerebralTest(presenter);
  });
  it('should set the scanner source based on props and close the selector modal', async () => {
    test.setState('showModal', 'SelectScannerSourceModal');
    test.setState('scanner', {});

    await test.runSequence('setScannerSourceSequence', {
      scannerSourceName: 'Test Scanner 1',
    });

    expect(applicationContext.getScanner().setSourceByName).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).toHaveBeenCalled();
    expect(test.getState('modal')).toEqual({});
  });
});
