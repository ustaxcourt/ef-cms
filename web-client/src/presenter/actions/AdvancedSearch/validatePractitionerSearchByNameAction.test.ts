import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePractitionerSearchByNameAction } from './validatePractitionerSearchByNameAction';

describe('validatePractitionerSearchByNameAction', () => {
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

  it('should call path.success and not path.error if practitionerName is on practitionerSearchByName', async () => {
    await runAction(validatePractitionerSearchByNameAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          practitionerSearchByName: { practitionerName: '123' },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with an error message and not call path.success if practitionerName is not on practitionerSearchByName', async () => {
    await runAction(validatePractitionerSearchByNameAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: { practitionerSearchByName: {} },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        messages: ['Enter a practitioner name'],
        title: 'Please correct the following errors:',
      },
      errors: {
        practitionerName: 'Enter a practitioner name',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
