import { closeMobileMenuAction } from './closeMobileMenuAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
