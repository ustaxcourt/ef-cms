import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validatePetitionFeePaymentAction } from './validatePetitionFeePaymentAction';
const { Case } = require('../../../../shared/src/business/entities/cases/Case');

presenter.providers.applicationContext = applicationContext;

describe('validatePetitionFeePaymentAction', () => {
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

  it('returns success path for valid data for a paid petition fee', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateYear: '2001',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('returns error path for invalid data for a paid petition fee', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toMatchObject({
      errors: {
        paymentDate: 'Enter a valid date payment date',
        petitionPaymentMethod: 'You must provide a valid payment method',
      },
    });
  });

  it('returns success path for valid data for a waived petition fee', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('returns error path for invalid data for a waived petition fee', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toMatchObject({
      errors: {
        paymentDateWaived: 'Enter a valid payment waived date',
      },
    });
  });

  it('returns success path for an unpaid petition fee', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });
});
