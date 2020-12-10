import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateRemoveFromTrialSessionAction } from './validateRemoveFromTrialSessionAction';

describe('validateRemoveFromTrialSessionAction', () => {
  let successStub;
  let errorStub;
  let mockState;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    mockState = {
      associatedJudge: 'Judge Fieri',
      caseStatus: 'Submitted',
      disposition: 'This is my disposition',
    };
  });

  it('should call path.success and not path.error if all requirements are met on state.modal', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: mockState,
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if disposition is not on state.modal', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { ...mockState, disposition: undefined },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        disposition: 'Enter a disposition',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if caseStatus is not on state.modal', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { ...mockState, caseStatus: undefined },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        caseStatus: 'Enter a case status',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with and error message and not call path.success if the length of state.modal.associatedJudge is over 50', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          ...mockState,
          associatedJudge: '0'.repeat(51),
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        associatedJudge:
          'The length of the associated judge must not be over 50',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with and error message and not call path.success if state.modal.associatedJudge is required', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          ...mockState,
          associatedJudge: undefined,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        associatedJudge: 'Enter an associated judge',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
