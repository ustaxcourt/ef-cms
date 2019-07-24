import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

jest.useFakeTimers();

describe('setIdleStatusIdleSequence', () => {
  it('should show the idle status modal and set a delayed logout timer', done => {
    test.setState('showModal', 'SomeOtherModal');
    test.runSequence('setIdleStatusIdleSequence');
    expect(test.getState('showModal')).toBe('AppTimeoutModal');
    const logoutTimer = test.getState('logoutTimer');
    expect(logoutTimer).not.toBeNull();
    jest.clearAllTimers();
    done();
  });
});
