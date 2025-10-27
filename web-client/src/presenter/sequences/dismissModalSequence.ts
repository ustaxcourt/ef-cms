import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';

export const dismissModalSequence = [clearModalAction, clearModalStateAction];
