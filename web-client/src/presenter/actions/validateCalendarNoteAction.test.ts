import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCalendarNoteAction } from './validateCalendarNoteAction';

describe('validateCalendarNoteAction', () => {
  let successStub;
  let errorStub;

  let mockNote;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockNote = {
      note: 'hello notes',
    };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCalendarNoteInteractor.mockReturnValue(null);

    await runAction(validateCalendarNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockNote,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCalendarNoteInteractor.mockReturnValue('error');
    await runAction(validateCalendarNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockNote,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
