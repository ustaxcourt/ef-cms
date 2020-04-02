import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateAddToTrialSessionAction } from './validateAddToTrialSessionAction';

describe('validateAddToTrialSessionAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and not path.error if trialSessionId is on state.modal', async () => {
    await runAction(validateAddToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { trialSessionId: '123' },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with and error message and not call path.success if trialSessionId is not on state.modal', async () => {
    await runAction(validateAddToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        trialSessionId: 'Select a Trial Session',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
