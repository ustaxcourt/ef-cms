import { navigateToPrintPreviewAction } from './navigateToPrintPreviewAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToPrintPreviewAction', () => {
  it('navigates to the print preview URL', async () => {
    const routeStub = jest.fn().mockResolvedValue(true);
    presenter.providers.router = { route: routeStub };
    await runAction(navigateToPrintPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: '123-19',
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/print-preview/123-19');
  });
});
