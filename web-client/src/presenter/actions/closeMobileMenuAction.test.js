import { closeMobileMenuAction } from './closeMobileMenuAction';
import { runAction } from 'cerebral/test';

describe('closeMobileMenuAction', () => {
  it('should set the value of state.header.showMobileMenu to false', async () => {
    const result = await runAction(closeMobileMenuAction, {
      state: {
        header: {
          showMobileMenu: true,
        },
      },
    });

    expect(result.state.header.showMobileMenu).toBeFalsy();
  });
});
