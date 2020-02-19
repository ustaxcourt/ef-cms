import { navigateToReviewPetitionFromPaperAction } from './navigateToReviewPetitionFromPaperAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('navigateToReviewPetitionFromPaperAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = sinon.stub();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to review petition url', async () => {
    await runAction(navigateToReviewPetitionFromPaperAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.calledOnce).toEqual(true);
  });
});
