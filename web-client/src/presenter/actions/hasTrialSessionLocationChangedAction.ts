import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialLocation';
import { state } from '@web-client/presenter/app.cerebral';

export const hasTrialSessionLocationChangedAction = ({
  get,
  path,
}: ActionProps) => {
  const updatedTrialSessionLocation = get(state.form);
  const currentTrialSessionLocation = get(state.formattedTrialSessionDetails);

  const shouldGenerateNCTL = shouldGenerateNoticeOfChangeTrialLocation(
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  );

  if (!shouldGenerateNCTL) return path.unchanged();
  return path.updated({
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  });
};
