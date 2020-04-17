import { navigateToPdfPreviewAction } from './navigateToPdfPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToPdfPreviewAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should navigate to the pdf preview page', async () => {
    await runAction(navigateToPdfPreviewAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenLastCalledWith('/pdf-preview');
  });
});
