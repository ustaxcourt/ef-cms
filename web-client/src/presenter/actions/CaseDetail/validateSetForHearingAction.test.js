import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateSetForHearingAction } from './validateSetForHearingAction';

describe('validateSetForHearingAction', () => {
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

  it('should call path.success and not path.error if calendarNotes and trialSessionId is on state.modal', async () => {
    await runAction(validateSetForHearingAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { calendarNotes: 'this is my note', trialSessionId: '123' },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if trialSessionId is not on state.modal', async () => {
    await runAction(validateSetForHearingAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { calendarNotes: 'note' },
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

  it('should call path.error with an error message and not call path.success if calendarNotes is not on state.modal', async () => {
    await runAction(validateSetForHearingAction, {
      modules: {
        presenter,
      },
      state: {
        modal: { trialSessionId: '123' },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        calendarNotes: 'Add a note.',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with and error message and not call path.success if the length of state.modal.calendarNotes is over 200', async () => {
    await runAction(validateSetForHearingAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          calendarNotes: '0'.repeat(201),
          trialSessionId: '6e3a34d9-262a-486b-86c8-7862c4522ab4',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      errors: {
        calendarNotes: 'The length of the note must not be over 200',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
