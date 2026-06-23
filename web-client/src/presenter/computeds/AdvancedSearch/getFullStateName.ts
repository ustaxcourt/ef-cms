import {
  US_STATES,
  US_STATES_OTHER,
} from '@shared/business/entities/EntityConstants';

export const getFullStateName = (
  stateAbbreviation: string | undefined,
): string | undefined => {
  if (!stateAbbreviation) {
    return;
  }

  return (
    US_STATES[stateAbbreviation] ||
    US_STATES_OTHER[stateAbbreviation] ||
    stateAbbreviation
  );
};
