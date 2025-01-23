import {
  RawTrialSession,
  TRIAL_SESSION_ADDRESS_PROPERTIES,
  TrialSessionLocationInfo,
} from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { isEqual } from 'lodash';

export function shouldGenerateNoticeOfChangeTrialLocation(
  currentTrialSessionLocation: RawTrialSession,
  updatedTrialSessionLocation: RawTrialSession,
): boolean {
  if (
    !currentTrialSessionLocation.isCalendared ||
    !updatedTrialSessionLocation.isCalendared
  )
    return false;

  if (
    currentTrialSessionLocation.proceedingType !==
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson ||
    updatedTrialSessionLocation.proceedingType !==
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson
  )
    return false;

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

  return !isEqual(currentLocation, updatedLocation);
}
