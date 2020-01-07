import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validatePetitionDetailsAction } from './validatePetitionDetailsAction';

let validateCaseDetailStub = jest.fn().mockReturnValue(null);

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    validateCaseDetailInteractor: validateCaseDetailStub,
  }),
};

describe('validatePetitionDetailsAction', () => {
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
    await runAction(validatePetitionDetailsAction, {
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

  it('should call the path success when no errors are found', async () => {
    validateCaseDetailStub = jest.fn().mockReturnValue('error');
    await runAction(validatePetitionDetailsAction, {
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
