import { navigateToFilePetitionSuccessAction } from './navigateToFilePetitionSuccessAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToFilePetitionSuccessAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to FilePetitionSuccess', async () => {
    await runAction(navigateToFilePetitionSuccessAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/file-a-petition/success');
  });
});
