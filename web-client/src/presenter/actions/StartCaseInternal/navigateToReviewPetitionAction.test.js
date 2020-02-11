import { navigateToReviewPetitionAction } from './navigateToReviewPetitionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('navigateToReviewPetitionAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = sinon.stub();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to review petition url', async () => {
    await runAction(navigateToReviewPetitionAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.calledOnce).toEqual(true);
  });
});
