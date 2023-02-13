import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { setShowAllLocationsFalseAction } from '../actions/setShowAllLocationsFalseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openAddToTrialModalSequence = showProgressSequenceDecorator([
  stopShowValidationAction,
  clearAlertsAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  setTrialSessionsOnModalAction,
  setShowAllLocationsFalseAction,
  setShowModalFactoryAction('AddToTrialModal'),
]);
