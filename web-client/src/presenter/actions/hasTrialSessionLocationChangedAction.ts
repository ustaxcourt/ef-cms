import {
  TRIAL_SESSION_ADDRESS_PROPERTIES,
  TrialSessionLocationInfo,
} from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { isEqual } from 'lodash';
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

  const currentLocation = TRIAL_SESSION_ADDRESS_PROPERTIES.reduce(
    (acc, prop) => {
      acc[prop] = currentTrialSessionLocation[prop];
      return acc;
    },
    {} as Record<
      keyof TrialSessionLocationInfo,
      TrialSessionLocationInfo[keyof TrialSessionLocationInfo]
    >,
  );

  const updatedLocation = TRIAL_SESSION_ADDRESS_PROPERTIES.reduce(
    (acc, prop) => {
      acc[prop] = updatedTrialSessionLocation[prop];
      return acc;
    },
    {} as Record<
      keyof TrialSessionLocationInfo,
      TrialSessionLocationInfo[keyof TrialSessionLocationInfo]
    >,
  );

  const hasNotChanged = isEqual(currentLocation, updatedLocation);
  if (hasNotChanged) return path.unchanged();
  return path.updated({
    currentTrialSessionLocation,
    updatedTrialSessionLocation,
  });
};
