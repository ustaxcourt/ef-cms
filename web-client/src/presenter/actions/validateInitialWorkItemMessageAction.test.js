import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateInitialWorkItemMessageAction } from './validateInitialWorkItemMessageAction';

describe('validateInitialWorkItemMessage', () => {
  let validateInitialWorkItemMessageStub;
  let successStub;
  let errorStub;

  let mockMessage;

  beforeEach(() => {
    validateInitialWorkItemMessageStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

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

  it('should call the success path when no errors are found', async () => {
    validateInitialWorkItemMessageStub = jest.fn().mockReturnValue(null);
    await runAction(validateInitialWorkItemMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockMessage,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateInitialWorkItemMessageStub = jest.fn().mockReturnValue('error');
    await runAction(validateInitialWorkItemMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockMessage,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
