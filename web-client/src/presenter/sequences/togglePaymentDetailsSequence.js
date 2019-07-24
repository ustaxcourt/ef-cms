import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const togglePaymentDetailsSequence = [
  toggle(state.paymentInfo.showDetails),
];
