import { navigateToDocumentQCAction } from './navigateToDocumentQCAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToDocumentQCAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Document QC', async () => {
    await runAction(navigateToDocumentQCAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/document-qc/my/inbox');
  });
});
