import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateOrderWithoutBodyAction } from './validateOrderWithoutBodyAction';

describe('validateOrderWithoutBodyAction', () => {
  let validateOrderWithoutBodyStub;
  let successStub;
  let errorStub;

  let mockOrderWithoutBody;

  beforeEach(() => {
    validateOrderWithoutBodyStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    mockOrderWithoutBody = {
      documentTitle: 'Order of Dismissal and Decision',
      documentType: 'Order of Dismissal and Decision',
      eventCode: 'ODD',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateOrderWithoutBodyInteractor: validateOrderWithoutBodyStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateOrderWithoutBodyStub = jest.fn().mockReturnValue(null);
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        modal: mockOrderWithoutBody,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateOrderWithoutBodyStub = jest.fn().mockReturnValue('error');
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        modal: mockOrderWithoutBody,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
