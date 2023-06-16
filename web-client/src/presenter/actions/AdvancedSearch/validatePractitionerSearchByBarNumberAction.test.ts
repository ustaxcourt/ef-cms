import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePractitionerSearchByBarNumberAction } from './validatePractitionerSearchByBarNumberAction';

describe('validatePractitionerSearchByBarNumberAction', () => {
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

  it('should call path.success and not path.error if barNumber is on practitionerSearchByBarNumber', async () => {
    await runAction(validatePractitionerSearchByBarNumberAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          practitionerSearchByBarNumber: { barNumber: '123' },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if barNumber is not on practitionerSearchByBarNumber', async () => {
    await runAction(validatePractitionerSearchByBarNumberAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: { practitionerSearchByBarNumber: {} },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        messages: ['Enter a bar number'],
        title: 'Please correct the following errors:',
      },
      errors: {
        barNumber: 'Enter a bar number',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
