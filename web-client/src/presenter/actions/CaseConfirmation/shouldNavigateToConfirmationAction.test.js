import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { shouldNavigateToConfirmationAction } from './shouldNavigateToConfirmationAction';

describe('shouldNavigateToConfirmationAction', () => {
  let proceedStub;
  let ignoreStub;

  beforeEach(() => {
    proceedStub = jest.fn();
    ignoreStub = jest.fn();

    presenter.providers.path = {
      ignore: ignoreStub,
      proceed: proceedStub,
    };
  });

  it('should return proceed if props.navigateToConfirmation is true', async () => {
    await runAction(shouldNavigateToConfirmationAction, {
      modules: {
        presenter,
      },
      props: {
        navigateToConfirmation: true,
      },
    });

    expect(proceedStub).toHaveBeenCalled();
  });

  it('should return ignore if props.navigateToConfirmation is false', async () => {
    await runAction(shouldNavigateToConfirmationAction, {
      modules: {
        presenter,
      },
      props: {
        navigateToConfirmation: false,
      },
    });

    expect(ignoreStub).toHaveBeenCalled();
  });
});
