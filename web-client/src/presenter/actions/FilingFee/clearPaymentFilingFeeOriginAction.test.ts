import { clearPaymentFilingFeeOriginAction } from '@web-client/presenter/actions/FilingFee/clearPaymentFilingFeeOriginAction';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPaymentFilingFeeOriginAction', () => {
  it('should clear paymentFilingFeeOrigin from cerebral state', async () => {
    const { state } = await runAction(clearPaymentFilingFeeOriginAction, {
      modules: { presenter },
      state: {
        paymentFilingFeeOrigin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      },
    });

    expect(state.paymentFilingFeeOrigin).toBeNull();
  });
});
