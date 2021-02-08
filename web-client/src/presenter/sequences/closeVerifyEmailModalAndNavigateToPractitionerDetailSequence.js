import { clearModalSequence } from './clearModalSequence';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';

export const closeVerifyEmailModalAndNavigateToPractitionerDetailSequence = [
  clearModalSequence,
  navigateToPractitionerDetailAction,
];
