import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionStartDateDifferencesAction = ({
  props,
  store,
}: ActionProps<{
  currentTrialSessionStartDate: any;
  updatedTrialSessionStartDate: any;
}>) => {
  const { currentTrialSessionStartDate, updatedTrialSessionStartDate } = props;
  store.set(state.trialSessionStartDateChangeModalInfo, {
    currentTrialSessionStartDate: currentTrialSessionStartDate.startDate,
    updatedTrialSessionStartDate: updatedTrialSessionStartDate.startDate,
  });
};
