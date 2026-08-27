import { isUserAssociatedWithTrialSessionAction } from '@web-client/presenter/actions/isUserDirectlyAssociatedToCaseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isUserDirectlyAssociatedToCase', () => {
  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  presenter.providers.path = {
    yes: pathYesStub,
    no: pathNoStub,
  };

  it('should return no if the user is not directly associated', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: false,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return no if no isDirectlyAssociated prop is found', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return yes if the user is directly associated', async () => {
    await runAction(isUserAssociatedWithTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
