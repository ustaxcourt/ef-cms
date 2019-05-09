import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

presenter.providers.applicationContext = applicationContext;

const test = CerebralTest(presenter);

describe('toggleAccountMenuSequence', () => {
  it('should show the account menu if it is currently hidden', () => {
    test.setState('isAccountMenuOpen', false);
    test.runSequence('toggleAccountMenuSequence');
    expect(test.getState('isAccountMenuOpen')).toBeTruthy();
  });

  it('should hide the account menu if it is currently shown', () => {
    test.setState('isAccountMenuOpen', true);
    test.runSequence('toggleAccountMenuSequence');
    expect(test.getState('isAccountMenuOpen')).toBeFalsy();
  });
});
