import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddPrivatePractitionerAction } from './validateAddPrivatePractitionerAction';
import sinon from 'sinon';

describe('validateAddPrivatePractitioner', () => {
  let validateAddPrivatePractitionerInteractorStub;
  let successStub;
  let errorStub;

  let mockAddPrivatePractitioner;

  beforeEach(() => {
    validateAddPrivatePractitionerInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockAddPrivatePractitioner = {
      representingPrimary: true,
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddPrivatePractitionerInteractor: validateAddPrivatePractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateAddPrivatePractitionerInteractorStub.returns(null);
    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateAddPrivatePractitionerInteractorStub.returns('error');
    await runAction(validateAddPrivatePractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPrivatePractitioner,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
