import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validatePetitionFeePaymentAction } from './validatePetitionFeePaymentAction';

let validateCaseDetailStub = jest.fn().mockReturnValue(null);

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    validateCaseDetailInteractor: validateCaseDetailStub,
  }),
};

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

  it('should call the path success when no errors are found', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateYear: '2001',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      petitionPaymentDate: '2001-01-01T05:00:00.000Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should not send a payment date to the interactor if it is not a valid date', async () => {
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      petitionPaymentDate: undefined,
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
    });
  });

  it('should call the path success when no errors are found', async () => {
    validateCaseDetailStub = jest.fn().mockReturnValue('error');
    await runAction(validatePetitionFeePaymentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });
    expect(errorStub).toHaveBeenCalled();
  });
});
