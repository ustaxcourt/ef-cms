import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { navigateToRequestAccessReviewAction } from './navigateToRequestAccessReviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToRequestAccessReviewAction', () => {
  let routerStub;

  const mockDocketNumber = '123-45';

  beforeAll(() => {
    routerStub = jest.fn();
    presenter.providers.applicationContext = applicationContext;

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

  it('should set the redactionAcknowledgement to false when the eventCode is EA and generation is manual', async () => {
    const results = await runAction(navigateToRequestAccessReviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form: {
          eventCode: 'EA',
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(results.state.form.redactionAcknowledgement).toBe(false);
  });

  it('should unset the redactionAcknowledgement state value when generationType is auto', async () => {
    const results = await runAction(navigateToRequestAccessReviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form: {
          eventCode: 'EA',
          generationType: GENERATION_TYPES.AUTO,
        },
      },
    });

    expect(results.state.form.redactionAcknowledgement).toBe(undefined);
  });

  it('should unset the redactionAcknowledgement state value when eventCode is not EA', async () => {
    const results = await runAction(navigateToRequestAccessReviewAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form: {
          eventCode: 'A',
          generationType: GENERATION_TYPES.MANUAL,
        },
      },
    });

    expect(results.state.form.redactionAcknowledgement).toBe(undefined);
  });
});
