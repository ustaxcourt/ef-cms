import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { state } from '@web-client/presenter/app.cerebral';

const setDismissModalAction = ({ store }: ActionProps) => {
  store.set(state.trialSessionChangeModalState, {
    persist: false,
  });
};

export const openConfirmTrialSessionLocationChangeModalSequence = [
  setConfirmTrialSessionLocationChangeModalAction,
  setDismissModalAction
];
