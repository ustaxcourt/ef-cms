import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionStartDateDifferencesAction = ({
  props,
  store,
}: ActionProps<{
  currentTrialSession: any;
  updatedTrialSession: any;
  persistModal: boolean
}>) => {
  const { currentTrialSession, updatedTrialSession, persistModal } = props;
  store.set(state.trialSessionStartDateChangeModalInfo, {
    currentTrialSessionStartDate: currentTrialSession.startDate,
    updatedTrialSessionStartDate: updatedTrialSession.startDate,
  });
  store.set(state.trialSessionChangeModalState, {
    persist: persistModal,
  });
};
