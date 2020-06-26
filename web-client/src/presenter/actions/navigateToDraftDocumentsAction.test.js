import { navigateToDraftDocumentsAction } from './navigateToDraftDocumentsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToDraftDocumentsAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Draft Documents for the given case', async () => {
    await runAction(navigateToDraftDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: '123',
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/case-detail/123/draft-documents');
  });
});
