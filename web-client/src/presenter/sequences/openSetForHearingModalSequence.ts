import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { setShowAllLocationsFalseAction } from '../actions/setShowAllLocationsFalseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openSetForHearingModalSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  stopShowValidationAction,
  getTrialSessionsAction,
  setTrialSessionsOnModalAction,
  setShowAllLocationsFalseAction,
  setShowModalFactoryAction('SetForHearingModal'),
]);
