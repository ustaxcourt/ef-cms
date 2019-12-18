import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCourtIssuedDocketEntryAction } from './validateCourtIssuedDocketEntryAction';
import sinon from 'sinon';

describe('validateCourtIssuedDocketEntryAction', () => {
  let validateCourtIssuedDocketEntryStub;
  let successStub;
  let errorStub;

  let mockDocketEntry;

  beforeEach(() => {
    validateCourtIssuedDocketEntryStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockDocketEntry = {
      data: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCourtIssuedDocketEntryInteractor: validateCourtIssuedDocketEntryStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateCourtIssuedDocketEntryStub.returns(null);
    await runAction(validateCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketEntry,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCourtIssuedDocketEntryStub.returns('error');
    await runAction(validateCourtIssuedDocketEntryAction, {
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
