import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoMyAccountSequence } from '../sequences/gotoMyAccountSequence';
import { presenter } from '../presenter-mock';

describe('gotoMyAccountSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMyAccountSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should change the page to MyAccount and close the opened menu', async () => {
    cerebralTest.setState('currentPage', 'SomeOtherPage');
    cerebralTest.setState('navigation.openMenu', true);
    await cerebralTest.runSequence('gotoMyAccountSequence');
    expect(cerebralTest.getState('currentPage')).toBe('MyAccount');
    expect(cerebralTest.getState('navigation.openMenu')).toBeUndefined();
  });
});
