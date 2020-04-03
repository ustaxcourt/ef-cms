import { navigateToPrintPreviewAction } from './navigateToPrintPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToPrintPreviewAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to print preview for the state.caseDetail.docketNumber', async () => {
    await runAction(navigateToPrintPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/print-preview/101-20');
  });
});
