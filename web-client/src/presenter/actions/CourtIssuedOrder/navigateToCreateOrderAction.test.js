import { navigateToCreateOrderAction } from './navigateToCreateOrderAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCreateOrderAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to create order url', async () => {
    await runAction(navigateToCreateOrderAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
      },
    });

    expect(routeStub).toHaveBeenCalled();
    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/123-20/create-order',
    );
  });
});
