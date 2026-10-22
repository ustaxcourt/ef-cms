jest.mock('@web-client/proxies/users/checkEmailExistsProxy');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validatePetitionerAction } from './validatePetitionerAction';
import { checkEmailIsPractitionerInteractor } from '@web-client/proxies/users/checkEmailIsPractitionerProxy';

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
    (checkEmailIsPractitionerInteractor as jest.Mock).mockResolvedValue(false);
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
          screenMetadata: { allPendingEmails: [] },
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('runs validation and should catch duplicate petitioner emails', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue(null);

    await runAction(validatePetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          petitioners: [{ email: '123@example.com' }],
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
            confirmEmail: '123@example.com',
          },
          screenMetadata: { allPendingEmails: [] },
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('runs validation and should catch duplicate practitioner emails', async () => {
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor.mockReturnValue(null);
    (checkEmailIsPractitionerInteractor as jest.Mock).mockResolvedValue(true);

    await runAction(validatePetitionerAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          partyType: PARTY_TYPES.petitioner,
          privatePractitioners: [{ email: '123@example.com' }],
          petitioners: [],
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
            confirmEmail: '123@example.com',
          },
          screenMetadata: { allPendingEmails: [] },
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
