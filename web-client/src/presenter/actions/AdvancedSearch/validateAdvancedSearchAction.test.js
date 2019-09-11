import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateAdvancedSearchAction } from './validateAdvancedSearchAction';
import sinon from 'sinon';

describe('validateAdvancedSearchAction', () => {
  let validateCaseSearchStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateCaseSearchStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateCaseSearchInteractor: validateCaseSearchStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates advanced case search successfully', async () => {
    validateCaseSearchStub.returns({});

    await runAction(validateAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseSearchStub.calledOnce).toEqual(true);
    expect(successStub.calledOnce).toEqual(true);
  });

  it('fails validation for advanced case search', async () => {
    validateCaseSearchStub.returns({ foo: 'bar' });

    await runAction(validateAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(validateCaseSearchStub.calledOnce).toEqual(true);
    expect(errorStub.calledOnce).toEqual(true);
  });
});
