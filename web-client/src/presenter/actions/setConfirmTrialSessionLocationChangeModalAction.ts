import { state } from '@web-client/presenter/app.cerebral';

export const setConfirmTrialSessionLocationChangeModalAction = ({
  store,
}: ActionProps) => {
  store.set(
    state.modal.showModal,
    'ConfirmTrialSessionLocationChangeModalDialog',
  );
};
