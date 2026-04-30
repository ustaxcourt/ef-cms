import { clearModalAction } from '../actions/clearModalAction';
import { clearModalFormAction } from '../actions/clearModalFormAction';

export const dismissModalSequence = [clearModalAction, clearModalFormAction];
