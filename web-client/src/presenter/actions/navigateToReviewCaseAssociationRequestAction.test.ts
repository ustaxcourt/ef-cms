import { GENERATION_TYPES } from '@web-client/getConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { navigateToReviewCaseAssociationRequestAction } from './navigateToReviewCaseAssociationRequestAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToReviewCaseAssociationRequestAction', () => {
  const mockDocketNumber = '123-45';

  const routerStub = jest.fn();
  presenter.providers.router = {
    route: routerStub,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should route to the review case association request page using state.caseDetail.docketNumber', async () => {
    await runAction(navigateToReviewCaseAssociationRequestAction, {
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
      `/case-detail/${mockDocketNumber}/case-association-request/review`,
    );
  });

  it('should set the redactionAcknowledgement to false when the eventCode is EA and generation is manual', async () => {
    const results = await runAction(
      navigateToReviewCaseAssociationRequestAction,
      {
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
      },
    );

    expect(results.state.form.redactionAcknowledgement).toBe(false);
  });

  it('should unset the redactionAcknowledgement state value when generationType is auto', async () => {
    const results = await runAction(
      navigateToReviewCaseAssociationRequestAction,
      {
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
      },
    );

    expect(results.state.form.redactionAcknowledgement).toBe(undefined);
  });

  it('should unset the redactionAcknowledgement state value when eventCode is not EA', async () => {
    const results = await runAction(
      navigateToReviewCaseAssociationRequestAction,
      {
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
      },
    );

    expect(results.state.form.redactionAcknowledgement).toBe(undefined);
  });
});
