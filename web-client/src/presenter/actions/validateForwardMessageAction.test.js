import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateForwardMessageAction } from './validateForwardMessageAction';

describe('validateForwardMessageAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateForwardMessageInteractor.mockReturnValue(null);
    await runAction(validateForwardMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateForwardMessageInteractor.mockReturnValue('error');
    await runAction(validateForwardMessageAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
