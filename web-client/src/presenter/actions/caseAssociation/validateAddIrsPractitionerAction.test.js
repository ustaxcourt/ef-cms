import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddIrsPractitionerAction } from './validateAddIrsPractitionerAction';
import sinon from 'sinon';

describe('validateAddIrsPractitioner', () => {
  let validateAddIrsPractitionerInteractorStub;
  let successStub;
  let errorStub;

  let mockAddIrsPractitioner;

  beforeEach(() => {
    validateAddIrsPractitionerInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockAddIrsPractitioner = {
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddIrsPractitionerInteractor: validateAddIrsPractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateAddIrsPractitionerInteractorStub.returns(null);
    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateAddIrsPractitionerInteractorStub.returns('error');
    await runAction(validateAddIrsPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddIrsPractitioner,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
