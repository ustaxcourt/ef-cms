import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateRemoveFromTrialSessionAction } from './validateRemoveFromTrialSessionAction';

presenter.providers.applicationContext = applicationContextForClient;

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

  it('should call path.error with and error message and not call path.success if state.modal.associatedJudge is required', async () => {
    await runAction(validateRemoveFromTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          ...mockState,
          associatedJudge: undefined,
          caseStatus: 'Submitted',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        associatedJudge: 'Select an associated judge',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
