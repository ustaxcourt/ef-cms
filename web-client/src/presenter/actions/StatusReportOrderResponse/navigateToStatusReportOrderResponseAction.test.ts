import { navigateToStatusReportOrderResponseAction } from './navigateToStatusReportOrderResponseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToStatusReportOrderResponseAction,', () => {
  presenter.providers.router = {
    route: jest.fn(),
  };

  it('should route to passed in url', async () => {
    await runAction(navigateToStatusReportOrderResponseAction, {
      modules: {
        presenter,
      },
      props: {
        url: '/test',
      },
    });

    expect(presenter.providers.router.route).toHaveBeenCalledWith('/test');
  });
});
