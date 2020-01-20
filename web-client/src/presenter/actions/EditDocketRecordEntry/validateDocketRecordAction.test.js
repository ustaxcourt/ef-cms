import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateDocketRecordAction } from './validateDocketRecordAction';
import sinon from 'sinon';

describe('validateDocketRecordAction', () => {
  let validateDocketRecordInteractorStub;
  let successStub;
  let errorStub;

  let mockDocketRecord;

  beforeEach(() => {
    validateDocketRecordInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockDocketRecord = {
      description: 'hello world',
      eventCode: 'HELLO',
      filingDate: '1990-01-01T05:00:00.000Z',
      index: 1,
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateDocketRecordInteractor: validateDocketRecordInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateDocketRecordInteractorStub.returns(null);
    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateDocketRecordInteractorStub.returns('error');
    await runAction(validateDocketRecordAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocketRecord,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
