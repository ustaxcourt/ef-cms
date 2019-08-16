import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseNoteAction } from './validateCaseNoteAction';
import sinon from './node_modules/sinon';

describe('validateCaseNote', () => {
  let validateCaseNoteStub;
  let successStub;
  let errorStub;

  let mockCaseNote;

  beforeEach(() => {
    validateCaseNoteStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockCaseNote = {
      notes: 'hello notes',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseNoteInteractor: validateCaseNoteStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateCaseNoteStub.returns(null);
    await runAction(validateCaseNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseNote,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCaseNoteStub.returns('error');
    await runAction(validateCaseNoteAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseNote,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
