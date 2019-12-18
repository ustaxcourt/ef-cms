import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAddRespondentAction } from './validateAddRespondentAction';
import sinon from 'sinon';

describe('validateAddRespondent', () => {
  let validateAddRespondentInteractorStub;
  let successStub;
  let errorStub;

  let mockAddRespondent;

  beforeEach(() => {
    validateAddRespondentInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockAddRespondent = {
      user: { userId: 'abc' },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateAddRespondentInteractor: validateAddRespondentInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateAddRespondentInteractorStub.returns(null);
    await runAction(validateAddRespondentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddRespondent,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateAddRespondentInteractorStub.returns('error');
    await runAction(validateAddRespondentAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockAddRespondent,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
