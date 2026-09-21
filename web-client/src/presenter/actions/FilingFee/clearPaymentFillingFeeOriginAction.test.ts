import { clearPaymentFillingFeeOriginAction } from '@web-client/presenter/actions/FilingFee/clearPaymentFillingFeeOriginAction';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPaymentFillingFeeOriginAction', () => {
  it('should clear paymentFillingFeeOrigin from cerebral state', async () => {
    const { state } = await runAction(clearPaymentFillingFeeOriginAction, {
      modules: { presenter },
      state: {
        paymentFillingFeeOrigin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      },
    });

    expect(state.paymentFillingFeeOrigin).toBeNull();
  });
});
