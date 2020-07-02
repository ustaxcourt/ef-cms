import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateSecondaryContactAction } from './validateSecondaryContactAction';

describe('validateSecondaryContactAction', () => {
  let successStub;
  let errorStub;

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('runs validation on the secondary contact with a successful result', async () => {
    applicationContext
      .getUseCases()
      .validateSecondaryContactInteractor.mockReturnValue(null);

    const result = await runAction(validateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactSecondary: {},
          partyType: 'Petitioner & spouse',
        },
      },
    });

    expect(result.state.validationErrors.contactSecondary).toEqual({});
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('runs validation on the secondary contact with an invalid result', async () => {
    applicationContext
      .getUseCases()
      .validateSecondaryContactInteractor.mockReturnValue('validation error');

    await runAction(validateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactSecondary: {
            address1: '',
            address2: 'asdf',
            city: 'Flavortown',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'TN',
          },
          partyType: 'Petitioner & spouse',
        },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
