import { navigateToEditUserContactAction } from './navigateToEditUserContactAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToEditUserContactAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Edit User Contact page', async () => {
    await runAction(navigateToEditUserContactAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/user/contact/edit');
  });
});
