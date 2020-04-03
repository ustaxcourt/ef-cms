import { canNavigateToReviewSavedPetitionScreenAction } from './canNavigateToReviewSavedPetitionScreenAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('canNavigateToReviewSavedPetitionScreenAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns yes path if the form.partyType is a truthy value', async () => {
    await runAction(canNavigateToReviewSavedPetitionScreenAction, {
      modules: { presenter },
      state: {
        form: {
          partyType: 'Petitioner',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
    expect(noStub).not.toHaveBeenCalled();
  });

  it('returns no path if the form.partyType is not defined', async () => {
    await runAction(canNavigateToReviewSavedPetitionScreenAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(yesStub).not.toHaveBeenCalled();
    expect(noStub).toHaveBeenCalled();
  });
});
