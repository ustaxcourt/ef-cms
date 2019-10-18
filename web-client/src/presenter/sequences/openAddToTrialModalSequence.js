import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { set } from 'cerebral/factories';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const openAddToTrialModalSequence = [
  stopShowValidationAction,
  getTrialSessionsAction,
  setTrialSessionsOnModalAction,
  set(state.modal.showAllLocations, false),
  set(state.showModal, 'AddToTrialModal'),
];
