import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openPrioritizeCaseModalSequence = [
  stopShowValidationAction,
  clearModalAction,
  setShowModalFactoryAction('PrioritizeCaseModal'),
];
