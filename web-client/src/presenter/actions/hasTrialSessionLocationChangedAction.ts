import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { shouldGenerateNoticeOfChangeTrialLocation } from '@shared/business/utilities/trialSession/hasTrialLocationBeenUpdated';
import { state } from '@web-client/presenter/app.cerebral';

export const hasTrialSessionLocationChangedAction = ({
  get,
  path,
}: ActionProps) => {
  const updatedTrialSessionLocation = get(state.form);
  const currentTrialSessionLocation = get(state.formattedTrialSessionDetails);

  if (
    currentTrialSessionLocation.proceedingType !==
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson ||
    updatedTrialSessionLocation.proceedingType !==
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson
  )
    return path.unchanged();

  const isUpdated = shouldGenerateNoticeOfChangeTrialLocation(
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  );

  if (!isUpdated) return path.unchanged();
  return path.updated({
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  });
};
