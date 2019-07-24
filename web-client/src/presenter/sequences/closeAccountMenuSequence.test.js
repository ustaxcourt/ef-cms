import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('closeAccountMenuSequence', () => {
  it('should close the account menu', () => {
    test.setState('isAccountMenuOpen', true);
    test.runSequence('closeAccountMenuSequence');
    expect(test.getState('isAccountMenuOpen')).toBeFalsy();
  });
});
