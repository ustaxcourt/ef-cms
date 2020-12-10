import { clearModalStateAction } from '../actions/clearModalStateAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openRemoveFromTrialSessionModalSequence = [
  clearModalStateAction,
  set(state.modal.trialSessionId, props.trialSessionId),
  setShowModalFactoryAction('RemoveFromTrialSessionModal'),
];
