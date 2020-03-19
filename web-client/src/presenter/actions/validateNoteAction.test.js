import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateNoteAction } from './validateNoteAction';

describe('validateNote', () => {
  let validateNoteStub;
  let successStub;
  let errorStub;

  let mockNote;

  beforeEach(() => {
    validateNoteStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockNote = {
      notes: 'hello notes',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateNoteInteractor: validateNoteStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateNoteStub = jest.fn().mockReturnValue(null);
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
    validateNoteStub = jest.fn().mockReturnValue('error');
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
