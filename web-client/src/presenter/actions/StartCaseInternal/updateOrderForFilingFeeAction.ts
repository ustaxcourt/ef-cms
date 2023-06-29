import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.form.orderForFilingFee based on the petitionPaymentStatus
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateOrderForFilingFeeAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  if (props.key === 'petitionPaymentStatus') {
    const { PAYMENT_STATUS } = applicationContext.getConstants();
    if (props.value === PAYMENT_STATUS.UNPAID) {
      store.set(state.form.orderForFilingFee, true);
    } else {
      store.set(state.form.orderForFilingFee, false);
    }
  }
};
