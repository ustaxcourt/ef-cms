import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateHearingNoteAction } from './validateHearingNoteAction';

describe('validateHearingNoteAction', () => {
  let mockSuccess;
  let mockError;

  beforeAll(() => {
    mockSuccess = jest.fn();
    mockError = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: mockError,
      success: mockSuccess,
    };
  });

  it('should return the valid path if the note is defined', async () => {
    await runAction(validateHearingNoteAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          note: 'this is a note',
        },
      },
    });
    expect(mockSuccess).toHaveBeenCalled();
  });

  it('should return the error path if the note is not defined', async () => {
    applicationContext
      .getUseCases()
      .validateHearingNoteInteractor.mockReturnValue({});

    await runAction(validateHearingNoteAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          note: null,
        },
      },
    });
    expect(mockError).toHaveBeenCalled();
  });
});
