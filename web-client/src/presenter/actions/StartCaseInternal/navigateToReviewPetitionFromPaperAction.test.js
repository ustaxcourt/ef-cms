import { navigateToReviewPetitionFromPaperAction } from './navigateToReviewPetitionFromPaperAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToReviewPetitionFromPaperAction', () => {
  let routeStub;

  beforeAll(() => {
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
