import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoMyAccountSequence } from '../sequences/gotoMyAccountSequence';
import { presenter } from '../presenter-mock';

describe('gotoMyAccountSequence', () => {
  let test;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMyAccountSequence,
    };
    test = CerebralTest(presenter);
  });

  it('should change the page to MyAccount and close the opened menu', async () => {
    test.setState('currentPage', 'SomeOtherPage');
    test.setState('navigation.openMenu', true);
    await test.runSequence('gotoMyAccountSequence');
    expect(test.getState('currentPage')).toBe('MyAccount');
    expect(test.getState('navigation.openMenu')).toBeUndefined();
  });
});
