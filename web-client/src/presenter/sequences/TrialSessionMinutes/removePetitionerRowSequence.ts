import { removePetitionerRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/removePetitionerRowAction';

export const removePetitionerRowSequence = [
  removePetitionerRowAction,
] as unknown as () => void;
