import { navigateToPathAction } from './navigateToPathAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPathAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to props.path if provided', async () => {
    await runAction(navigateToPathAction, {
      modules: {
        presenter,
      },
      props: {
        path: '/search',
      },
    });

    expect(routeStub.mock.calls.length).toBe(1);
    expect(routeStub.mock.calls[0][0]).toBe('/search');
  });

  it('navigates to / if props.path is not provided', async () => {
    await runAction(navigateToPathAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.mock.calls.length).toBe(1);
    expect(routeStub.mock.calls[0][0]).toBe('/');
  });
});
