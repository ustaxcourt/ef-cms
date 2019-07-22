import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateInitialWorkItemMessageAction } from './validateInitialWorkItemMessageAction';
import sinon from 'sinon';

describe('validateInitialWorkItemMessage', () => {
  let validateInitialWorkItemMessageStub;
  let successStub;
  let errorStub;

  let mockMessage;

  beforeEach(() => {
    validateInitialWorkItemMessageStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockMessage = {
      message: 'hello world',
      recipientId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      section: 'docket',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateInitialWorkItemMessageInteractor: validateInitialWorkItemMessageStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateInitialWorkItemMessageStub.returns(null);
    await runAction(validateInitialWorkItemMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockMessage,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateInitialWorkItemMessageStub.returns('error');
    await runAction(validateInitialWorkItemMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockMessage,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
