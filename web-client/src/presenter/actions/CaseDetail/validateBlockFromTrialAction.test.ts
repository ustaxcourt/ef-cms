import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateBlockFromTrialAction } from './validateBlockFromTrialAction';

describe('validateBlockFromTrialAction', () => {
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

  it('should call path.success and not path.error if a reason is set on state.modal', async () => {
    await runAction(validateBlockFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          reason: 'something',
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if reason is not on state.modal', async () => {
    await runAction(validateBlockFromTrialAction, {
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
        reason: 'Provide a reason',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
