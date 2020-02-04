import { SERVICE_INDICATOR_TYPES } from '../../../../shared/src/business/entities/cases/CaseConstants';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validatePetitionerInformationFormAction } from './validatePetitionerInformationFormAction';
const {
  ContactFactory,
} = require('../../../../shared/src/business/entities/contacts/ContactFactory');

describe('validatePetitionerInformationFormAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('runs validation on the petitioner information form with a successful result', async () => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validatePetitionerInformationFormInteractor: jest
          .fn()
          .mockReturnValue({ contactPrimary: null }),
      }),
    };

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
        },
        form: {
          contactPrimary: {
            address1: '234 Abc Ln',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
          partyType: 'Petitioner',
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('returns an error when missing address1', async () => {
    presenter.providers.applicationContext = applicationContext;

    await runAction(validatePetitionerInformationFormAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
        },
        form: {
          contactPrimary: {
            address1: '',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
          partyType: 'Petitioner',
        },
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0]).toMatchObject({
      errors: {
        contactPrimary: {
          address1: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.address1,
        },
      },
    });
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
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            state: 'TN',
          },
          contactSecondary: {
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Gal Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            state: 'TN',
          },
        },
        form: {
          contactPrimary: {
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            state: 'TN',
          },
          contactSecondary: {
            address1: '123 Abc St',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Gal Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            state: 'TN',
          },
          partyType: 'Petitioner',
        },
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0]).toMatchObject({
      errors: {
        contactPrimary: {
          serviceIndicator: expect.anything(),
        },
        contactSecondary: {
          serviceIndicator: expect.anything(),
        },
      },
    });
  });
});
