import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateOrderAdvancedSearchAction } from './validateOrderAdvancedSearchAction';

describe('validateOrderAdvancedSearchAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('validates advanced order search successfully', async () => {
    applicationContext
      .getUseCases()
      .validateOrderAdvancedSearchInteractor.mockReturnValue({});

    await runAction(validateOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { advancedSearchForm: { orderSearch: {} } },
    });

    expect(
      applicationContext.getUseCases().validateOrderAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('fails validation for advanced order search', async () => {
    applicationContext
      .getUseCases()
      .validateOrderAdvancedSearchInteractor.mockReturnValue({ foo: 'bar' });

    await runAction(validateOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: { advancedSearchForm: { orderSearch: {} } },
    });

    expect(
      applicationContext.getUseCases().validateOrderAdvancedSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('validates advanced order search with invalid dates', async () => {
    applicationContext
      .getUseCases()
      .validateOrderAdvancedSearchInteractor.mockReturnValue({
        errors: {
          startDate: 'Enter date in format MM/DD/YYYY.',
          endDate: 'Enter date in format MM/DD/YYYY.',
        },
      });

    await runAction(validateOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          orderSearch: {
            startDate: 'invalid-date',
            endDate: 'invalid-date',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      alertError: {
        messages: [
          'Enter date in format MM/DD/YYYY.',
          'Enter date in format MM/DD/YYYY.',
        ],
        title:
          'Errors were found. Please correct the date range selection and resubmit.',
      },
      errors: {
        startDate: 'Enter date in format MM/DD/YYYY.',
        endDate: 'Enter date in format MM/DD/YYYY.',
      },
    });
  });
});
