import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateNoteAction } from './validateNoteAction';
import sinon from 'sinon';

describe('validateNote', () => {
  let validateNoteStub;
  let successStub;
  let errorStub;

  let mockNote;

  beforeEach(() => {
    validateNoteStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

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

  it('should call the path success when no errors are found', async () => {
    validateNoteStub.returns(null);
    await runAction(validateNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockNote,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateNoteStub.returns('error');
    await runAction(validateNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockNote,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
