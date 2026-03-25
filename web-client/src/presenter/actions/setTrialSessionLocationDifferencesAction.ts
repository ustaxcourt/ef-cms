import { TrialSessionLocationInfo } from '@shared/business/entities/trialSessions/TrialSession';
import { state } from '@web-client/presenter/app.cerebral';

export const setTrialSessionLocationDifferencesAction = ({
  props,
  store,
}: ActionProps<{
  currentTrialSession: TrialSessionLocationInfo;
  updatedTrialSession: TrialSessionLocationInfo;
}>) => {
  const { currentTrialSession, updatedTrialSession } = props;
  store.set(state.trialSessionLocationChangeModalInfo, {
    currentTrialSessionLocation: currentTrialSession,
    updatedTrialSessionLocation: updatedTrialSession,
  });
};
