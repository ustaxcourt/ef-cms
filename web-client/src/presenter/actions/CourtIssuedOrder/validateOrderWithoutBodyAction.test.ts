import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateOrderWithoutBodyAction } from './validateOrderWithoutBodyAction';

describe('validateOrderWithoutBodyAction', () => {
  let validateOrderWithoutBodyStub = jest.fn();

  let mockOrderWithoutBody = {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateOrderWithoutBodyInteractor: validateOrderWithoutBodyStub,
      }),
    };

    presenter.providers.path = {
      error: jest.fn(),
      success: jest.fn(),
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateOrderWithoutBodyStub.mockReturnValue(null);
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        modal: mockOrderWithoutBody,
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    validateOrderWithoutBodyStub.mockReturnValue('error');
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        modal: mockOrderWithoutBody,
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalled();
  });
});
