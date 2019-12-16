import { navigateToPrintPreviewAction } from './navigateToPrintPreviewAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToPrintPreviewAction', () => {
  it('navigates to the print preview URL with props.caseId', async () => {
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

  it('navigates to the print preview URL with props.caseDetail.caseId', async () => {
    const routeStub = jest.fn().mockResolvedValue(true);
    presenter.providers.router = { route: routeStub };
    await runAction(navigateToPrintPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: '123-19' },
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/print-preview/123-19');
  });

  it('navigates to the print preview URL with state.caseDetail.docketNumber', async () => {
    const routeStub = jest.fn().mockResolvedValue(true);
    presenter.providers.router = { route: routeStub };
    await runAction(navigateToPrintPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-19' },
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/print-preview/123-19');
  });
});
