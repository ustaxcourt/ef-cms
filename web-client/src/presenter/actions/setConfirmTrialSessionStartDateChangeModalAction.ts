import { state } from '@web-client/presenter/app.cerebral';

export const setConfirmTrialSessionStartDateChangeModalAction = ({
  store,
}: ActionProps) => {
  store.set(
    state.modal.showModal,
    'ConfirmTrialSessionStartDateChangeModalDialog',
  );
};
