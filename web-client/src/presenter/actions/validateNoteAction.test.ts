import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNoteAction } from './validateNoteAction';

describe('validateNote', () => {
  let successStub;
  let errorStub;

  let mockNote;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockNote = {
      notes: 'hello notes',
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
      .validateNoteInteractor.mockReturnValue(null);

    await runAction(validateNoteAction, {
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
      .validateNoteInteractor.mockReturnValue('error');
    await runAction(validateNoteAction, {
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
