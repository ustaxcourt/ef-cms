import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddPractitionerAction } from './validateAddPractitionerAction';
import sinon from 'sinon';

describe('validateAddPractitioner', () => {
  let validateAddPractitionerInteractorStub;
  let successStub;
  let errorStub;

  let mockAddPractitioner;

  beforeEach(() => {
    validateAddPractitionerInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockAddPractitioner = {
      representingPrimary: true,
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddPractitionerInteractor: validateAddPractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateAddPractitionerInteractorStub.returns(null);
    await runAction(validateAddPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPractitioner,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateAddPractitionerInteractorStub.returns('error');
    await runAction(validateAddPractitionerAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddPractitioner,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
