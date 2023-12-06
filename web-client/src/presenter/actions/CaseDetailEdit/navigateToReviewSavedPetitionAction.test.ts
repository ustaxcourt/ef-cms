import { navigateToReviewSavedPetitionAction } from './navigateToReviewSavedPetitionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToReviewSavedPetitionAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

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
        caseDetail: { docketNumber: '123-20' },
        docketEntryId: 'abc',
      },
    });

    expect(routeStub).toHaveBeenCalled();
  });
});
