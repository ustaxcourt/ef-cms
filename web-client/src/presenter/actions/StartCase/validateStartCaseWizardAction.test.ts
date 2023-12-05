import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateStartCaseWizardAction } from './validateStartCaseWizardAction';

describe('validateStartCaseWizardAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue(null);
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
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue({ some: 'error' });
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

  it('should call the error path with contactPrimary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 0 }],
      });

    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...MOCK_CASE,
          contactPrimary: {
            contactType: CONTACT_TYPES.primary,
            name: 'Test Primary',
          },
          contactSecondary: {
            contactType: CONTACT_TYPES.secondary,
            name: 'Test Secondary',
          },
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactPrimary: { inCareOf: mockInCareOfError },
    });
  });

  it('should call the error path with contactSecondary errors from petitioners array', async () => {
    const mockInCareOfError = 'Enter name for in care of';
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue({
        petitioners: [{ inCareOf: mockInCareOfError, index: 1 }],
      });

    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ...MOCK_CASE,
          contactPrimary: {
            contactType: CONTACT_TYPES.primary,
            name: 'Test Primary',
          },
          contactSecondary: {
            contactType: CONTACT_TYPES.secondary,
            name: 'Test Secondary',
          },
        },
      },
    });

    expect(errorStub.mock.calls[0][0].errors).toEqual({
      contactSecondary: { inCareOf: mockInCareOfError },
    });
  });

  it('should call the error path, providing an error display order and errorDisplayMap, when errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateStartCaseWizardInteractor.mockReturnValue({
        petitioners: [
          {
            inCareOf: 'Enter name for in care of',
          },
        ],
      });

    await runAction(validateStartCaseWizardAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_CASE,
      },
    });

    expect(errorStub.mock.calls[0][0].errorDisplayOrder).toEqual([
      'petitionFile',
      'hasIrsNotice',
      'name',
      'inCareOf',
      'address1',
      'city',
      'state',
      'postalCode',
      'phone',
      'procedureType',
      'preferredTrialLocation',
    ]);
  });
});
