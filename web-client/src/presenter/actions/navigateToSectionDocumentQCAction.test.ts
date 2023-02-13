import { navigateToSectionDocumentQCAction } from './navigateToSectionDocumentQCAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToSectionDocumentQCAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Document QC', async () => {
    await runAction(navigateToSectionDocumentQCAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/document-qc/section/inbox');
  });
});
