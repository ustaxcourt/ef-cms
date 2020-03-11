import { canNavigateToReviewSavedPetitionScreenAction } from './canNavigateToReviewSavedPetitionScreenAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('canNavigateToReviewSavedPetitionScreenAction', () => {
  let yesStub;
  let noStub;

  beforeEach(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns yes path if the caseDetail.partyType is a truthy value', async () => {
    await runAction(canNavigateToReviewSavedPetitionScreenAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          partyType: 'Petitioner',
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
    expect(noStub).not.toHaveBeenCalled();
  });

  it('returns no path if the caseDetail.partyType is not defined', async () => {
    await runAction(canNavigateToReviewSavedPetitionScreenAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
      },
    });

    expect(yesStub).not.toHaveBeenCalled();
    expect(noStub).toHaveBeenCalled();
  });
});
