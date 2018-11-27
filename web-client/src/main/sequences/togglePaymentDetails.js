import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const togglePaymentDetails = [toggle(state`paymentInfo.showDetails`)];
