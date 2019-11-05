import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setTrialSessionsOnModalAction } from '../actions/TrialSession/setTrialSessionsOnModalAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const openAddToTrialModalSequence = [
  stopShowValidationAction,
  setWaitingForResponseAction,
  getTrialSessionsAction,
  unsetWaitingForResponseAction,
  setTrialSessionsOnModalAction,
  set(state.modal.showAllLocations, false),
  setShowModalFactoryAction('AddToTrialModal'),
];
