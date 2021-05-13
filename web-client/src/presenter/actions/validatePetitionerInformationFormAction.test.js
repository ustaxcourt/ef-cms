import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePetitionerInformationFormAction } from './validatePetitionerInformationFormAction';

describe('validatePetitionerInformationFormAction', () => {
  let successStub;
  let errorStub;
  let SERVICE_INDICATOR_TYPES;
  let PARTY_TYPES;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    ({
      PARTY_TYPES,
      SERVICE_INDICATOR_TYPES,
    } = applicationContext.getConstants());
  });

  it('runs validation on the petitioner information form with a successful result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: null,
      });

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        form: {
          contactPrimary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('returns an error when validation fails', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: 'validation errors',
      });

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        form: {
          contactPrimary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(errorStub).toBeCalled();
  });

  it('returns an error when attempting to change from paper to electronic service for contactPrimary and contactSecondary', async () => {
    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
        },
        form: {
          contactPrimary: {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
          contactSecondary: {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(errorStub).toBeCalled();
  });

  it('should not validate the contactPrimary email if it is not being changed', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: null,
        contactSecondary: null,
      });

    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(undefined);

    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {},
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              email: 'testing@example.com',
            },
          ],
        },
        form: {
          contactPrimary: {
            email: 'testing@example.com',
          },
          contactSecondary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateUpdateUserEmailInteractor,
    ).not.toBeCalled();
  });

  it('should not validate the contactPrimary email if it is empty', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: null,
        contactSecondary: null,
      });

    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(undefined);

    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {},
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        form: {
          contactPrimary: {},
          contactSecondary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateUpdateUserEmailInteractor,
    ).not.toBeCalled();
  });

  it('should validate the contactPrimary email if being changed', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: null,
        contactSecondary: null,
      });

    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue(undefined);

    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {},
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        form: {
          contactPrimary: {
            email: 'new@example.com',
          },
          contactSecondary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateUpdateUserEmailInteractor,
    ).toHaveBeenCalledTimes(1);
    expect(successStub).toBeCalled();
  });

  it('should return an error if the contactPrimary email is not valid', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInformationFormInteractor.mockReturnValue({
        contactPrimary: null,
        contactSecondary: null,
      });

    applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor.mockReturnValue('validation errors');

    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {},
          petitioners: [{ contactType: CONTACT_TYPES.primary }],
        },
        form: {
          contactPrimary: {
            email: 'new@example.com',
          },
          contactSecondary: {},
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateUpdateUserEmailInteractor,
    ).toHaveBeenCalledTimes(1);
    expect(errorStub).toBeCalled();
  });
});
