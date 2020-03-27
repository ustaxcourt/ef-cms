import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

describe('setIdleStatusIdleSequence', () => {
  let test;
  beforeAll(() => {
    jest.useFakeTimers();
    presenter.providers.applicationContext = applicationContext;
    test = CerebralTest(presenter);
  });
  it('should show the idle status modal and set a delayed logout timer', async () => {
    test.setState('modal.showModal', 'SomeOtherModal');
    await test.runSequence('setIdleStatusIdleSequence');
    expect(test.getState('modal.showModal')).toBe('AppTimeoutModal');
    const logoutTimer = test.getState('logoutTimer');
    expect(logoutTimer).not.toBeNull();
    jest.clearAllTimers();
  });
});
