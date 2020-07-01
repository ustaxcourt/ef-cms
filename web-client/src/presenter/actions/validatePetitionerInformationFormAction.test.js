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
          contactPrimary: {},
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
          contactPrimary: {},
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
          contactPrimary: {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
          contactSecondary: {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
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
});
