import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateOrderWithoutBodyAction } from './validateOrderWithoutBodyAction';
import sinon from 'sinon';

describe('validateOrderWithoutBodyAction', () => {
  let validateOrderWithoutBodyStub;
  let successStub;
  let errorStub;

  let mockOrderWithoutBody;

  beforeEach(() => {
    validateOrderWithoutBodyStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockOrderWithoutBody = {
      documentTitle: 'Order of Dismissal and Decision',
      documentType: 'Order of Dismissal and Decision',
      eventCode: 'ODD',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateOrderWithoutBody: validateOrderWithoutBodyStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateOrderWithoutBodyStub.returns(null);
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockOrderWithoutBody,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateOrderWithoutBodyStub.returns('error');
    await runAction(validateOrderWithoutBodyAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockOrderWithoutBody,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
