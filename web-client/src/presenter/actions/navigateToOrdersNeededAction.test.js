import { navigateToOrdersNeededAction } from './navigateToOrdersNeededAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToOrdersNeededAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to orders needed summary url when given docketNumber', async () => {
    await runAction(navigateToOrdersNeededAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
      },
    });

    expect(routeStub.mock.calls.length).toBe(1);
    expect(routeStub.mock.calls[0][0]).toBe(
      '/case-detail/123-19/orders-needed',
    );
  });

  it('does not navigate to orders needed summary url when there is no docketNumber', async () => {
    await runAction(navigateToOrdersNeededAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.mock.calls.length).toBe(0);
  });
});
