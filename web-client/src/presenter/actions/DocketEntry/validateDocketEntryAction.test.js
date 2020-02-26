import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateDocketEntryAction } from './validateDocketEntryAction';
import sinon from 'sinon';

describe('validateDocketEntryAction', () => {
  let validateDocketEntryStub;
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeEach(() => {
    validateDocketEntryStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateDocketEntryInteractor: validateDocketEntryStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateDocketEntryStub.returns(null);
    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateDocketEntryStub.returns('error');
    await runAction(validateDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
