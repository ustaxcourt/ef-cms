import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseDeadlineAction } from './validateCaseDeadlineAction';
import sinon from 'sinon';

describe('validateCaseDeadlineAction', () => {
  let validateCaseDeadlineStub;
  let successStub;
  let errorStub;

  let mockCaseDeadline;

  beforeEach(() => {
    validateCaseDeadlineStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    mockCaseDeadline = {
      caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'hello world',
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseDeadlineInteractor: validateCaseDeadlineStub,
      }),
      getUtilities: () => ({
        prepareDateFromString: () => '2019-03-01T21:42:29.073Z',
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateCaseDeadlineStub.returns(null);
    await runAction(validateCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseDeadline,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCaseDeadlineStub.returns('error');
    await runAction(validateCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseDeadline,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
