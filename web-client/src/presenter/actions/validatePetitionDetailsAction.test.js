import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validatePetitionDetailsAction } from './validatePetitionDetailsAction';

let validateCaseDetailStub = jest.fn().mockReturnValue(null);
const successStub = jest.fn();
const errorStub = jest.fn();

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    validateCaseDetailInteractor: validateCaseDetailStub,
  }),
};

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('validatePetitionDetailsAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the success path when no errors are found for a paid case', async () => {
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

  it('should call the success path when no errors are found for an unpaid case', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
        },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found for a waived case', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path when no errors are found for a case with an IRS notice date', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2001',
        },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      irsNoticeDate: '2001-01-01T05:00:00.000Z',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should send preferredTrialCity to the use case as null if it is not on the form', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      preferredTrialCity: null,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should send preferredTrialCity to the use case if it is on the form', async () => {
    await runAction(validatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: { preferredTrialCity: 'Fresno, California' },
      },
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      preferredTrialCity: 'Fresno, California',
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when errors are found', async () => {
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
