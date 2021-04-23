import { clearModalAction } from '../actions/clearModalAction';
import { removePetitionerFromCaseAction } from '../actions/caseAssociation/removePetitionerFromCaseAction';

export const removePetitionerFromCaseSequence = [
  clearModalAction,
  removePetitionerFromCaseAction,
];
