import { navigateToPrintableCaseConfirmationAction } from './navigateToPrintableCaseConfirmationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPrintableCaseConfirmationAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Messages', async () => {
    await runAction(navigateToPrintableCaseConfirmationAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-19',
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/case-detail/101-19/confirmation');
  });
});
