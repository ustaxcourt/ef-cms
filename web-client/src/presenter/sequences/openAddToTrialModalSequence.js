import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { set } from 'cerebral/factories';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { state } from 'cerebral';

export const openAddToTrialModalSequence = [
  set(state.showValidation, false),
  getTrialSessionsAction,
  setTrialSessionsOnModalAction,
  set(state.modal.showAllLocations, false),
  set(state.showModal, 'AddToTrialModal'),
];
