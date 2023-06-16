import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseDocketNumberSearchAction } from './validateCaseDocketNumberSearchAction';

describe('validateCaseDocketNumberSearchAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and not path.error if docketNumber is on state.advancedSearchForm.docketNumberSearch', async () => {
    await runAction(validateCaseDocketNumberSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          caseSearchByDocketNumber: { docketNumber: '123' },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if docketNumber is not on state.advancedSearchForm.docketNumberSearch', async () => {
    await runAction(validateCaseDocketNumberSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: { caseSearchByDocketNumber: {} },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        messages: ['Enter a docket number'],
        title: 'Please correct the following errors:',
      },
      errors: {
        docketNumber: 'Enter a docket number',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
