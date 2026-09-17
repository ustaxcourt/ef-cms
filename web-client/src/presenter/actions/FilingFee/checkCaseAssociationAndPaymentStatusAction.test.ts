import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { checkCaseAssociationAndPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/checkCaseAssociationAndPaymentStatusAction';
import { PAYMENT_FILLING_FEE_ORIGIN } from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOrigin';
import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';

describe('checkCaseAssociationAndPaymentStatusAction', () => {
  const pathDashboardStub = jest.fn();
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    dashboard: pathDashboardStub,
    success: pathSuccessStub,
    error: pathErrorStub,
  };

  beforeEach(() => {
    pathDashboardStub.mockClear();
    pathSuccessStub.mockClear();
    pathErrorStub.mockClear();
  });

  it('should error if the case has already been paid', async () => {
    await runAction(checkCaseAssociationAndPaymentStatusAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
      },
      state: {
        caseDetail: { petitionPaymentStatus: PAYMENT_STATUS.PAID },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should error if the user is not related to the case', async () => {
    await runAction(checkCaseAssociationAndPaymentStatusAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: false,
      },
      state: {
        caseDetail: { petitionPaymentStatus: PAYMENT_STATUS.UNPAID },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should succeed if the user is related to the case, and the fee is unpaid', async () => {
    await runAction(checkCaseAssociationAndPaymentStatusAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
      },
      state: {
        caseDetail: { petitionPaymentStatus: PAYMENT_STATUS.UNPAID },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathDashboardStub).not.toHaveBeenCalled();
  });

  it('should go to the dashboard when origin prop is dashboard', async () => {
    await runAction(checkCaseAssociationAndPaymentStatusAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
        origin: PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD,
      },
      state: {
        caseDetail: { petitionPaymentStatus: PAYMENT_STATUS.UNPAID },
      },
    });

    expect(pathDashboardStub).toHaveBeenCalled();
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });
});
