import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { setIdleStatusIdleSequence } from '../sequences/setIdleStatusIdleSequence';

describe('setIdleStatusIdleSequence', () => {
  let cerebralTest;
  beforeAll(() => {
    jest.useFakeTimers();
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      setIdleStatusIdleSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });
  it('should show the idle status modal and set a delayed logout timer', async () => {
    cerebralTest.setState('modal.showModal', 'SomeOtherModal');
    await cerebralTest.runSequence('setIdleStatusIdleSequence');
    expect(cerebralTest.getState('modal.showModal')).toBe('AppTimeoutModal');
    const logoutTimer = cerebralTest.getState('logoutTimer');
    expect(logoutTimer).not.toBeNull();
    jest.clearAllTimers();
  });
});
