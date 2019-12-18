import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openUnprioritizeCaseModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  setShowModalFactoryAction('UnprioritizeCaseModal'),
];
