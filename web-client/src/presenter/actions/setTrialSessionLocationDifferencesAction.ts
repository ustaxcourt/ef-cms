import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionLocationDifferencesAction = ({
  props,
  store,
}: ActionProps<{
  currentTrialSessionLocation: TrialSessionLocationInfo;
  updatedTrialSessionLocation: TrialSessionLocationInfo;
}>) => {
  const { currentTrialSessionLocation, updatedTrialSessionLocation } = props;
  store.set(state.trialSessionLocationChangeModalInfo, {
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  });
};
