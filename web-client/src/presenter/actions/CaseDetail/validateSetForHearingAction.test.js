import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateSetForHearingAction } from './validateSetForHearingAction';

presenter.providers.applicationContext = applicationContextForClient;

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

  it('should call path.error with an error message and not call path.success if the calendar note is not valid', async () => {
    presenter.providers.applicationContext.getUseCases().validateHearingNoteInteractor =
      jest.fn().mockReturnValue({
        note: 'That would be invalid, man.',
      });

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
        calendarNotes: 'That would be invalid, man.',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
