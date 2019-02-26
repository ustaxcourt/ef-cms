import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const togglePaymentDetailsSequence = [
  toggle(state.paymentInfo.showDetails),
];
