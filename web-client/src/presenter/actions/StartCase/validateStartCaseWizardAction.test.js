import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateStartCaseWizardAction } from './validateStartCaseWizardAction';

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
    validateStartCaseWizardStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

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
    validateStartCaseWizardStub = jest.fn().mockReturnValue(null);
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateStartCaseWizardStub = jest.fn().mockReturnValue({ some: 'error' });
    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
