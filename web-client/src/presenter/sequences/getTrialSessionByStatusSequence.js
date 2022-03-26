import { getTrialSessionsByStatusAction } from '../actions/TrialSession/getTrialSessionsByStatusAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getTrialSessionByStatusSequence = showProgressSequenceDecorator([
  getTrialSessionsByStatusAction,
  setTrialSessionsAction,
]);
