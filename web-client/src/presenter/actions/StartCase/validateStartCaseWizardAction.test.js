import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateStartCaseWizardAction } from './validateStartCaseWizardAction';
import sinon from 'sinon';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    validateStartCaseWizardInteractor: () =>
      'hello from validate start case wizard',
  }),
};

describe('validateStartCaseWizardAction', () => {
  let validateStartCaseWizardStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateStartCaseWizardStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateStartCaseWizardInteractor: validateStartCaseWizardStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateStartCaseWizardStub.returns(null);
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateStartCaseWizardStub.returns({ some: 'error' });
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
  });
});
