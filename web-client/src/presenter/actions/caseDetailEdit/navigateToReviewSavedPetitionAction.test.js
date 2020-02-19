import { navigateToReviewSavedPetitionAction } from './navigateToReviewSavedPetitionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('navigateToReviewSavedPetitionAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = sinon.stub();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to review url', async () => {
    await runAction(navigateToReviewSavedPetitionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        documentId: 'abc',
      },
    });

    expect(routeStub.calledOnce).toEqual(true);
  });
});
