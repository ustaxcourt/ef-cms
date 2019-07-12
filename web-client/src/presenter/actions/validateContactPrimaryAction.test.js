import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateContactPrimaryAction } from './validateContactPrimaryAction';
import sinon from 'sinon';

describe('validateContactPrimaryAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('validates the primary contact with a successful result', async () => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validatePrimaryContactInteractor: sinon.stub().returns(null),
      }),
    };

    const result = await runAction(validateContactPrimaryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          contactPrimary: {},
          partyType: 'Petitioner',
        },
      },
    });

    expect(result.state.validationErrors.contactPrimary).toEqual({});
    expect(successStub.calledOnce).toEqual(true);
  });

  it('validates the primary contact with an invalid result', async () => {
    presenter.providers.applicationContext = applicationContext;

    const result = await runAction(validateContactPrimaryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
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

    expect(result.state.validationErrors.contactPrimary).toEqual({
      address1: 'Address is a required field.',
    });
    expect(errorStub.calledOnce).toEqual(true);
  });
});
