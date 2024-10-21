import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePetitionerAction } from './validatePetitionerAction';

describe('validatePetitionerAction', () => {
  let successStub;
  let errorStub;

  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('runs validation on the contact with a successful result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue(null);

    const result = await runAction(validatePetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          petitioners: [{}],
        },
        form: {
          contact: {},
        },
      },
    });

    expect(result.state.validationErrors).toBeUndefined();
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('runs validation on the contact with an invalid result', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue('validation errors');

    await runAction(validatePetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          petitioners: [{}],
        },
        form: {
          contact: {
            address1: '',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Roslindis Angelino',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
