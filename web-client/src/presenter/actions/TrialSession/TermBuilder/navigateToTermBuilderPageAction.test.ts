import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '@web-client/presenter/presenter-mock';
import { navigateToTermBuilderPageAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/navigateToTermBuilderPageAction';

describe('navigateToTermBuilderPageAction', () => {
  beforeEach(() => {
    presenter.providers.router = {
      route: jest.fn(),
    };
  });

  it('should test', async () => {
    await runAction(navigateToTermBuilderPageAction, {
      modules: {
        presenter,
      },
    });

    const routeCalls = (presenter.providers.router.route as jest.Mock).mock
      .calls;
    expect(routeCalls.length).toEqual(1);
    expect(routeCalls[0][0]).toEqual('/trial-session/term-builder');
  });
});
