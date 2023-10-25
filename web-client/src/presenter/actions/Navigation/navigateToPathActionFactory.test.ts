import { navigateToPathActionFactory } from './navigateToPathActionFactory';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPathActionFactory', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to props.path if provided', async () => {
    await runAction(navigateToPathActionFactory('/some-path'), {
      modules: {
        presenter,
      },
    });

    expect(routeStub.mock.calls.length).toBe(1);
    expect(routeStub.mock.calls[0][0]).toBe('/some-path');
  });
});
