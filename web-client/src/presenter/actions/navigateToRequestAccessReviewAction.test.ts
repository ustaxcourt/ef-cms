import { navigateToRequestAccessReviewAction } from './navigateToRequestAccessReviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToRequestAccessReviewAction', () => {
  let routerStub;

  const mockDocketNumber = '123-45';

  beforeAll(() => {
    routerStub = jest.fn();

    presenter.providers.router = {
      route: routerStub,
    };
  });

  it('should route to the request access review page using state.caseDetail.docketNumber', async () => {
    await runAction(navigateToRequestAccessReviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(routerStub.mock.calls[0][0]).toBe(
      `/case-detail/${mockDocketNumber}/request-access/review`,
    );
  });
});
