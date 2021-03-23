import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openSetForHearingModalSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  stopShowValidationAction,
  getTrialSessionsAction,
  setTrialSessionsOnModalAction,
  set(state.modal.showAllLocations, false),
  setShowModalFactoryAction('SetForHearingModal'),
]);
