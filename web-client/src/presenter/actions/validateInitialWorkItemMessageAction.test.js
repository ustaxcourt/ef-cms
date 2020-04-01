import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateInitialWorkItemMessageAction } from './validateInitialWorkItemMessageAction';

describe('validateInitialWorkItemMessage', () => {
  let successStub;
  let errorStub;

  let mockMessage;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockMessage = {
      message: 'hello world',
      recipientId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      section: 'docket',
    };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateInitialWorkItemMessageInteractor.mockReturnValue(null);
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
    applicationContext
      .getUseCases()
      .validateInitialWorkItemMessageInteractor.mockReturnValue('error');
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
