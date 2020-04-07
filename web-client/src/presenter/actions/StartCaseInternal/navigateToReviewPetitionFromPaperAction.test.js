import { navigateToReviewPetitionFromPaperAction } from './navigateToReviewPetitionFromPaperAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToReviewPetitionFromPaperAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = jest.fn();

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

    expect(routeStub.mock.calls.length).toEqual(1);
  });
});
