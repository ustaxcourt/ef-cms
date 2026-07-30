import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { checkCaseAssociationAndPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/checkCaseAssociationAndPaymentStatusAction';
import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';

describe('checkCaseAssociationAndPaymentStatusAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    success: pathSuccessStub,
    error: pathErrorStub,
  };

  it('Should error if the case has already been payed', async () => {
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

  it('Should error if the user is not related to the case', async () => {
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

  it('Should succeed if the user is related to the case, and the fee is unpaid', async () => {
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
  });
});
