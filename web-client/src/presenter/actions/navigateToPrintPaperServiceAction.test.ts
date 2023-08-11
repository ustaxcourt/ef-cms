import { navigateToPrintPaperServiceAction } from './navigateToPrintPaperServiceAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPrintPaperServiceAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to print preview for the state.caseDetail.docketNumber', async () => {
    await runAction(navigateToPrintPaperServiceAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/print-paper-service/101-20');
  });
});
