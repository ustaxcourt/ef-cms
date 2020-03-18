import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateSecondaryContactAction } from './validateSecondaryContactAction';
const {
  ContactFactory,
} = require('../../../../shared/src/business/entities/contacts/ContactFactory');

describe('validateSecondaryContactAction', () => {
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

  it('runs validation on the secondary contact with a successful result', async () => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateSecondaryContactInteractor: jest.fn().mockReturnValue(null),
      }),
    };

    const result = await runAction(validateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {},
          partyType: 'Petitioner & spouse',
        },
      },
    });

    expect(result.state.validationErrors.contactSecondary).toEqual({});
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('runs validation on the secondary contact with an invalid result', async () => {
    presenter.providers.applicationContext = applicationContext;

    const result = await runAction(validateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactSecondary: {
            address1: '',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: 'domestic',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
          partyType: 'Petitioner & spouse',
        },
      },
    });

    expect(result.state.validationErrors.contactSecondary).toEqual({
      address1: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.address1,
    });
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
