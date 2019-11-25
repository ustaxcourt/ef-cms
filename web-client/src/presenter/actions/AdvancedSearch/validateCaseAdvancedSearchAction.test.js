import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseAdvancedSearchAction } from './validateCaseAdvancedSearchAction';
import sinon from 'sinon';

describe('validateCaseAdvancedSearchAction', () => {
  let validateCaseAdvancedSearchStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateCaseAdvancedSearchStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseAdvancedSearchInteractor: validateCaseAdvancedSearchStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates advanced case search successfully', async () => {
    validateCaseAdvancedSearchStub.returns({});

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseAdvancedSearchStub.calledOnce).toEqual(true);
    expect(successStub.calledOnce).toEqual(true);
  });

  it('fails validation for advanced case search', async () => {
    validateCaseAdvancedSearchStub.returns({ foo: 'bar' });

    await runAction(validateCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseAdvancedSearchStub.calledOnce).toEqual(true);
    expect(errorStub.calledOnce).toEqual(true);
  });
});
