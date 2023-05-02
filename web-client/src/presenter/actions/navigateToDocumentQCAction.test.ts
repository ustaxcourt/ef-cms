import { navigateToDocumentQCAction } from './navigateToDocumentQCAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToDocumentQCAction', () => {
  const mockRouter = jest.fn();

  beforeAll(() => {
    presenter.providers.router = {
      route: mockRouter,
    };
  });

  it('navigates to Document QC', async () => {
    await runAction(navigateToDocumentQCAction, {
      modules: {
        presenter,
      },
    });

    expect(mockRouter).toHaveBeenCalledWith('/document-qc/my/inbox');
  });
});
